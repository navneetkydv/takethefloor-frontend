// src/components/recorder/CategoryPicker.jsx
//
// Toggleable category pills. No selection = spin from all categories.

import { CATEGORIES } from '../../features/recordings/topics.data.js';

export function CategoryPicker({ selected, onToggle }) {
  // Split categories into rows of 6
  const rows = [];
  for (let i = 0; i < CATEGORIES.length; i += 6) {
    rows.push(CATEGORIES.slice(i, i + 6));
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {rows.map((row, rowIndex) => (
        <div 
          key={rowIndex} 
          className={`flex flex-wrap justify-center gap-2 ${rowIndex > 0 ? 'mt-1' : ''}`}
        >
          {row.map((category) => {
            const isActive = selected.includes(category);
            return (
              <button
                key={category}
                onClick={() => onToggle(category)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? 'border-violet-400 bg-violet-500/20 text-violet-200'
                    : 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}