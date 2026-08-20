// src/features/recordings/topics.data.js
//
// Static topics, tagged by category — spinning happens entirely
// client-side. Backend just receives whichever `text` string is picked
// as `topic` on recording creation, nothing category-related is sent.

export const CATEGORIES = [
  'Technology',
  'Business',
  'Education',
  'Culture',
  'Sports',
  'Philosophy',
  'Politics',
  'Health',
  'Environment',
];

export const TOPICS = [
  { text: 'AI will replace most software engineers within ten years.', category: 'Technology' },
  { text: 'Remote work should be the default, not the exception.', category: 'Business' },
  { text: 'Every school should offer mental health classes.', category: 'Education' },
  { text: 'Social media has done more harm than good.', category: 'Culture' },
  { text: 'Home-field advantage matters more than most fans realize.', category: 'Sports' },
  { text: 'Free will is an illusion.', category: 'Philosophy' },
  { text: 'Term limits should apply to every elected office.', category: 'Politics' },
  { text: 'Sleep is more important than diet for long-term health.', category: 'Health' },
  { text: 'Individual action barely matters for climate change — only policy does.', category: 'Environment' },
  { text: 'A four-day work week would make companies more productive, not less.', category: 'Business' },
  { text: 'Standardized testing does more harm than good in schools.', category: 'Education' },
  { text: 'Cancel culture has gone too far.', category: 'Culture' },
  { text: 'Money can buy happiness, past a certain point.', category: 'Philosophy' },
  { text: 'Cities should be designed around pedestrians, not cars.', category: 'Environment' },
  { text: 'The best programming language is the one you already know.', category: 'Technology' },
];

/**
 * Picks a random topic. If `selectedCategories` is empty, picks from all
 * topics; otherwise picks only from topics matching one of the selected
 * categories.
 */
export function spinTopic(selectedCategories = []) {
  const pool =
    selectedCategories.length === 0
      ? TOPICS
      : TOPICS.filter((t) => selectedCategories.includes(t.category));

  const finalPool = pool.length > 0 ? pool : TOPICS; // fall back if a filter somehow empties the pool
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}