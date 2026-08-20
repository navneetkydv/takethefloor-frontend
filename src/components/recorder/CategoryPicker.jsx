// src/components/recorder/CategoryPicker.jsx
//
// Toggleable category pills. No selection = spin from all categories.

import { CATEGORIES } from '../../features/recordings/topics.data.js';

export function CategoryPicker({ selected, onToggle }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {CATEGORIES.map((category) => {
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
  );
}