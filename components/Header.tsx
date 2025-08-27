
import React from 'react';
import { PresentationIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-slate-800 shadow-md">
      <div className="container mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <PresentationIcon className="w-10 h-10 text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Your Text, Your Style</h1>
            <p className="text-md text-gray-500 dark:text-gray-400">Auto-Generate a Presentation with AI</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
