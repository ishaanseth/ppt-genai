import React from "react";
import { Slide } from "../types";

interface SlidePreviewProps {
  slides: Slide[];
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ slides }) => {
  return (
    <div className="space-y-6">
      {slides.map((slide, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-lg shadow p-6 w-full max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-2">
            {index + 1}. {slide.title}
          </h3>
          <hr className="mb-4 border-gray-200 dark:border-slate-600" />

          <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 text-sm">
            {slide.content.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          {slide.speakerNotes && (
            <div className="mt-4 pt-3 border-t border-dashed border-gray-300 dark:border-slate-500">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                <strong>Speaker Notes:</strong> {slide.speakerNotes}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SlidePreview;
