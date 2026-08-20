// src/components/recorder/TopicSpinner.jsx
//
// Dark card showing the current topic prominently, with faded
// previous/next topics above and below for a "reel" feel — a simplified
// version of the stacked-card spin effect, without a full animation
// library. Category pills sit above, controlling which pool is spun from.

import { useState } from 'react';
import { CategoryPicker } from './CategoryPicker.jsx';
import { spinTopic } from '../../features/recordings/topics.data.js';

export function TopicSpinner({ onSelect, disabled }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [current, setCurrent] = useState(() => spinTopic([]));
  const [prevText, setPrevText] = useState(null);
  const [nextText, setNextText] = useState(null);

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSpin = () => {
    if (disabled) return;
    const nextTopic = spinTopic(selectedCategories);
    setPrevText(current.text);
    setNextText(nextTopic.text); // brief preview flash, cleared after render below
    setCurrent(nextTopic);
    onSelect?.(nextTopic.text);
    // clear the transient preview lines shortly after, purely cosmetic
    setTimeout(() => setNextText(null), 150);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-neutral-900 p-6 text-white">
      <div className="mb-6 flex flex-col items-center gap-4">
        <p className="text-center text-sm text-gray-400">
          Pick categories, or leave blank for anything.
        </p>
        <CategoryPicker selected={selectedCategories} onToggle={toggleCategory} />
      </div>

      <div className="flex flex-col items-center gap-4 py-4">
        {prevText && (
          <p className="max-w-md text-center text-sm text-gray-600 line-through opacity-40">
            {prevText}
          </p>
        )}

        <p className="max-w-md text-center text-xl font-semibold leading-snug">
          {current.text}
        </p>
        <p className="text-xs uppercase tracking-wide text-violet-400">{current.category}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleSpin}
          disabled={disabled}
          className="rounded-full bg-violet-500 px-6 py-3 font-medium text-white hover:bg-violet-600 disabled:opacity-50"
        >
          🎲 Spin
        </button>
      </div>
    </div>
  );
}