
import React, { useState, useCallback } from 'react';
import { Slide } from './types';
import { generateSlidesFromText } from './services/geminiService';
import { createPresentation } from './services/pptxService';
import Header from './components/Header';
import InputForm from './components/InputForm';
import SlidePreview from './components/SlidePreview';
import Loader from './components/Loader';
import { DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [guidance, setGuidance] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [templateFile, setTemplateFile] = useState<File | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!text) {
      setError('Please provide the source text.');
      return;
    }
    if (!apiKey) {
      setError('Please provide your Gemini API key.');
      return;
    }
    if (!templateFile) {
        setError('Please upload a PowerPoint template file (.pptx or .potx).');
        return;
    }

    setIsLoading(true);
    setError(null);
    setSlides([]);

    try {
      const generatedSlides = await generateSlidesFromText(text, guidance, apiKey);
      setSlides(generatedSlides);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error(e);
      setError(`Failed to generate presentation: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [text, guidance, apiKey, templateFile]);
  
  const handleDownload = async () => {
    if (slides.length > 0) {
      try {
        await createPresentation(slides, templateFile);
      } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
        console.error(e);
        setError(`Failed to download presentation: ${errorMessage}`);
      }
    } else {
        setError("No slides to download. Please generate a presentation first.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <InputForm
            text={text}
            setText={setText}
            guidance={guidance}
            setGuidance={setGuidance}
            apiKey={apiKey}
            setApiKey={setApiKey}
            setTemplateFile={setTemplateFile}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 min-h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">Preview</h2>
                {slides.length > 0 && (
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        <DownloadIcon />
                        Download .pptx
                    </button>
                )}
            </div>
            <div className="flex-grow relative">
                {isLoading && <Loader />}
                {error && <div className="text-red-600 bg-red-100 p-4 rounded-lg">{error}</div>}
                {!isLoading && !error && slides.length === 0 && (
                    <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
                        <p>Your generated slide preview will appear here.</p>
                    </div>
                )}
                {slides.length > 0 && <SlidePreview slides={slides} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
