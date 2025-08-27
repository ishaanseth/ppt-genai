
import React, { useState } from 'react';
import { UploadIcon, WandIcon } from './icons';
const PROVIDERS = ["Gemini", "OpenAI", "Anthropic"];

interface InputFormProps {
  text: string;
  setText: (text: string) => void;
  guidance: string;
  setGuidance: (guidance: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  setTemplateFile: (file: File | null) => void;
  provider: string;
  setProvider: (provider: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const GUIDANCE_TEMPLATES = [
  "Turn into an investor pitch deck",
  "Summarize as a research presentation",
  "Create a sales deck for a new product",
  "Generate a technical deep-dive",
];

const InputForm: React.FC<InputFormProps> = ({
  text,
  setText,
  guidance,
  setGuidance,
  apiKey,
  setApiKey,
  setTemplateFile,
  provider,
  setProvider,
  onGenerate,
  isLoading,
}) => {
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTemplateFile(file);
      setFileName(file.name);
    } else {
      setTemplateFile(null);
      setFileName('');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 space-y-6">
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">1. Provide Your Content</h2>
      
      <div>
        <label htmlFor="main-text" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Paste your text, markdown, or prose
        </label>
        <textarea
          id="main-text"
          rows={12}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your content here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-gray-50"
        />
      </div>

      <div>
        <label htmlFor="guidance" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Optional Guidance (e.g., tone, structure)
        </label>
        <input
          id="guidance"
          type="text"
          value={guidance}
          onChange={(e) => setGuidance(e.target.value)}
          placeholder="e.g., 'Make it a professional pitch deck'"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition dark:bg-slate-700 dark:border-slate-600 dark:placeholder-gray-400 dark:text-gray-50"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {GUIDANCE_TEMPLATES.map((template) => (
            <button
              key={template}
              onClick={() => setGuidance(template)}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-indigo-100 hover:text-indigo-700 transition dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-indigo-500 dark:hover:text-white"
            >
              {template}
            </button>
          ))}
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">2. Configure Output</h2>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          Choose LLM Provider
        </label>
        <select
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-gray-50"
        >
          {PROVIDERS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
          {provider} API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter your ${provider} API key`}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-gray-50"
        />
      </div>

      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">
            Upload PowerPoint Template (.pptx, .potx)
        </label>
        <label className="flex items-center justify-center w-full px-3 py-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-gray-50 transition dark:border-slate-600 dark:hover:border-indigo-500 dark:hover:bg-slate-700">
            <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                <UploadIcon />
                <span>{fileName || 'Click to upload template'}</span>
            </div>
            <input id="file-upload" type="file" className="hidden" accept=".pptx,.potx" onChange={handleFileChange} />
        </label>
      </div>

      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <WandIcon />
        {isLoading ? 'Generating...' : 'Generate Presentation'}
      </button>
    </div>
  );
};

export default InputForm;
