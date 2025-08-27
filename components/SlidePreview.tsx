
import React from 'react';
import { Slide } from '../types';

interface SlidePreviewProps {
  slides: Slide[];
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slides }) => {
  return (
    <div className="absolute inset-0 overflow-y-auto pr-2 space-y-4">
      {slides.map((slide, index) => (
        <div key={index} className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow-sm p-6 aspect-[16/9] flex flex-col">
          <div className="flex-shrink-0">
             <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 truncate">{index + 1}. {slide.title}</h3>
             <hr className="my-2 border-gray-200 dark:border-slate-600" />
          </div>
          <div className="flex-grow overflow-y-auto text-sm">
            <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
              {slide.content.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
            {slide.speakerNotes && (
                <div className="mt-4 pt-2 border-t border-dashed border-gray-300 dark:border-slate-500">
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                        <strong>Speaker Notes:</strong> {slide.speakerNotes}
                    </p>
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlidePreview;
