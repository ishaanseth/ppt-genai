
import React, { useState, useEffect } from 'react';
import { WandIcon } from './icons';

const loadingMessages = [
    "Analyzing your text...",
    "Structuring slide content...",
    "Generating speaker notes...",
    "Brewing coffee for the AI...",
    "Almost there...",
];

const Loader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 bg-white bg-opacity-80 flex flex-col items-center justify-center z-10 rounded-lg">
      <div className="flex items-center justify-center space-x-2">
        <WandIcon className="w-8 h-8 text-indigo-600 animate-pulse" />
        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{loadingMessages[messageIndex]}</p>
    </div>
  );
};

export default Loader;
