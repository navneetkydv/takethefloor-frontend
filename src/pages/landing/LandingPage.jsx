// src/pages/landing/LandingPage.jsx

import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">Speak confidently, every day.</h1>
      <p className="max-w-md text-gray-600">
        Spin a topic, record yourself, get instant AI feedback on your speaking.
      </p>
      <Link
        to="/login"
        className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800"
      >
        Get Started
      </Link>
    </main>
  );
}