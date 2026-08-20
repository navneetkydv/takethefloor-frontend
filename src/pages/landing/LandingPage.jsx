// src/pages/landing/LandingPage.jsx

import { Link } from 'react-router-dom';

const STEPS = [
  { title: 'Spin a topic', desc: 'Pick a category or leave it to chance.' },
  { title: 'Speak your mind', desc: 'Up to 10 minutes, extendable if you need more.' },
  { title: 'Get instant feedback', desc: 'AI scores your clarity, structure, and fluency.' },
  { title: 'Come back tomorrow', desc: 'Consistency is what actually builds the skill.' },
];

const AUDIENCES = [
  { title: 'Interview prep', desc: 'Practice thinking on your feet before it counts.' },
  { title: 'Public speaking', desc: 'Build confidence with private, judgment-free reps.' },
  { title: 'Fluency building', desc: 'Sharpen your English speaking, one topic at a time.' },
];

const FAQS = [
  {
    q: 'Is my recording private?',
    a: 'Yes — your recordings are stored privately and only used to generate your feedback.',
  },
  {
    q: 'How does the AI evaluation work?',
    a: 'Your speech is transcribed, then analyzed for pacing, filler words, structure, and clarity, with a written summary and suggestions.',
  },
  { q: 'Can I cancel anytime?', a: 'Yes — there\'s no auto-renewal. You pay per period, on your terms.' },
  { q: 'How many sessions can I do per day?', a: 'Up to 10 practice sessions a day, to keep it a sustainable daily habit.' },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Nav />
      <Hero />
      <HowItWorks />
      <Audiences />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
      <span className="text-lg font-semibold">GetRiff</span>
      <Link
        to="/login"
        className="rounded-full bg-violet-500 px-4 py-2 text-sm font-medium hover:bg-violet-600"
      >
        Get Started
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Spin for a <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">topic</span>.
        <br />
        Speak with confidence.
      </h1>
      <p className="mt-4 max-w-xl text-gray-400">
        A random topic every session, an AI coach that actually tells you what to fix. Build real
        speaking confidence in ten minutes a day.
      </p>
      <Link
        to="/login"
        className="mt-8 rounded-full bg-violet-500 px-8 py-4 font-medium hover:bg-violet-600"
      >
        Try it free →
      </Link>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold">How it works</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, i) => (
          <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <span className="text-sm text-violet-400">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-2 font-semibold">{step.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Audiences() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold">Who it's for</h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {AUDIENCES.map((a) => (
          <div key={a.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold">Simple pricing</h2>
      <div className="mt-8 inline-block rounded-2xl border border-violet-400/30 bg-violet-500/10 p-8">
        <p className="text-4xl font-bold">₹299<span className="text-lg text-gray-400">/month</span></p>
        <p className="mt-2 text-sm text-gray-400">Try it first for ₹49 / 7 days.</p>
        <Link
          to="/login"
          className="mt-6 inline-block rounded-full bg-violet-500 px-6 py-3 font-medium hover:bg-violet-600"
        >
          Start your trial
        </Link>
      </div>
    </section>
  );
}

function FAQ() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold">Frequently asked</h2>
      <div className="mt-8 flex flex-col gap-4">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <p className="font-medium">{f.q}</p>
            <p className="mt-1 text-sm text-gray-400">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <h2 className="text-3xl font-semibold">Ready to find your voice?</h2>
      <Link
        to="/login"
        className="mt-6 inline-block rounded-full bg-violet-500 px-8 py-4 font-medium hover:bg-violet-600"
      >
        Get Started →
      </Link>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} GetRiff. All rights reserved.
    </footer>
  );
}