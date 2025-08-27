import React, { useState } from "react";
import Header from "./components/Header";
import InputForm from "./components/InputForm";
import SlidePreview from "./components/SlidePreview";
import Loader from "./components/Loader";

import { Slide } from "./types";

import { generateSlidesFromText as generateGemini } from "./services/geminiService";
import { generateSlidesFromTextOpenAI } from "./services/openaiService";
import { generateSlidesFromTextAnthropic } from "./services/anthropicService";
import { createPresentation } from "./services/pptxService";

const App: React.FC = () => {
  const [text, setText] = useState("");
  const [guidance, setGuidance] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [provider, setProvider] = useState("Gemini"); // default
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text) {
      alert("Please provide some text.");
      return;
    }
    if (!apiKey) {
      alert(`Please provide your ${provider} API key.`);
      return;
    }

    setIsLoading(true);
    try {
      let generatedSlides: Slide[] = [];

      if (provider === "Gemini") {
        generatedSlides = await generateGemini(text, guidance, apiKey);
      } else if (provider === "OpenAI") {
        generatedSlides = await generateSlidesFromTextOpenAI(text, guidance, apiKey);
      } else if (provider === "Anthropic") {
        generatedSlides = await generateSlidesFromTextAnthropic(text, guidance, apiKey);
      }

      setSlides(generatedSlides);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate slides. Check console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (slides.length === 0) {
      alert("No slides to download.");
      return;
    }
    try {
      await createPresentation(slides, templateFile);
    } catch (err: any) {
      console.error(err);
      alert("Failed to generate presentation file.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <InputForm
          text={text}
          setText={setText}
          guidance={guidance}
          setGuidance={setGuidance}
          apiKey={apiKey}
          setApiKey={setApiKey}
          provider={provider}
          setProvider={setProvider}
          setTemplateFile={setTemplateFile}
          onGenerate={handleGenerate}
          isLoading={isLoading}
        />

        {isLoading && <Loader />}

        {slides.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">
              Preview
            </h2>
            <SlidePreview slides={slides} />
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              Download PPTX
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
