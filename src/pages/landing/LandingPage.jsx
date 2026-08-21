import { Link } from "react-router-dom";
import heroImg from "../../assets/hero-bgf.png";
import navImg from "../../assets/logo.png";

const STEPS = [
  {
    title: "Spin a topic",
    desc: "Pick a category or leave it to chance.",
    tag: "PICK A CATEGORY",
  },
  {
    title: "Speak your mind",
    desc: "60 seconds, extendable if you need more.",
    tag: "NO SCRIPT, NO RETAKES",
  },
  {
    title: "Get instant feedback",
    desc: "AI scores your clarity, structure, and fluency.",
    tag: "INSTANT FEEDBACK",
  },
  // {
  //   title: "Come back tomorrow",
  //   desc: "Consistency is what actually builds the skill.",
  //   tag: "BUILD THE STREAK",
  // },
];

const AUDIENCES = [
  {
    title: "Interview prep",
    desc: "Practice thinking on your feet before it counts.",
  },
  {
    title: "Public speaking",
    desc: "Build confidence with private, judgment-free reps.",
  },
  {
    title: "Fluency building",
    desc: "Sharpen your English speaking, one topic at a time.",
  },
];

const FAQS = [
  {
    q: "Is my recording private?",
    a: "Yes — your recordings are stored privately and only used to generate your feedback.",
  },
  {
    q: "How does the AI evaluation work?",
    a: "Your speech is transcribed, then analyzed for pacing, filler words, structure, and clarity, with a written summary and suggestions.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — there's no auto-renewal. You pay per period, on your terms.",
  },
  {
    q: "How many sessions can I do per day?",
    a: "Up to 10 practice sessions a day, to keep it a sustainable daily habit.",
  },
];

const TRANSCRIPT_PARTS = [
  { t: "So " },
  { t: "um", k: "filler" },
  { t: ", airplane mode is actually " },
  { t: "kind of", k: "filler" },
  { t: " my favorite setting because it " },
  { t: "forces", k: "emphasis" },
  {
    t: " me to be present — you can't reach for your phone, and suddenly the flight becomes this ",
  },
  { t: "quiet pocket", k: "emphasis" },
  { t: " where I actually think." },
];
const BASE_FEATURES = [
  "Daily impromptu topic",
  "Analysis on filler words & pauses",
  "Coaching on clarity, confidence & word choice",
  "10 bonus recordings + analysis per day",
];
 
const PLANS = [
  {
    title: "7-day Impromptu Challenge",
    tag: "Starter pack",
    regular: 249,
    offer: 199,
    features: BASE_FEATURES,
    cta: "Start 7-day challenge",
  },
  {
    title: "14-day Impromptu Challenge",
    tag: "For the committed",
    regular: 449,
    offer: 349,
    features: [...BASE_FEATURES, "Deeper, longer practice for more growth"],
    cta: "Start 14-day challenge",
    popular: true,
  },
];

const METRICS = [
  {
    label: "Clarity",
    value: 82,
    color: "bg-violet-400",
    note: "Strong opening premise, but the middle loses shape.",
  },
  {
    label: "Filler rate",
    sub: "4 flagged",
    value: 74,
    color: "bg-amber-400",
    note: '"um," "kind of" cluster around your transitions — replace with a half-second pause.',
  },
  {
    label: "Confidence",
    value: 68,
    color: "bg-orange-500",
    note: 'Hedges like "kind of" soften the close.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <Nav />
      <Hero />
      <HowItWorks />
      <SpeechCoach />
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
      <img src={navImg} alt="TakeTHEfloor" className="h-5 w-auto" />
      <Link to="/login" className="text-sm text-shadow-gray-600">
        Sign in
      </Link>
    </nav>
  );
}

function Hero() {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-12 text-center">
      <h1 className="p-2 text-4xl font-bold text-zinc-200 sm:text-5xl">
        <span className="bg-amber-50 bg-clip-text text-transparent">
          Become dangerously
        </span>{" "}
        <span className="bg-gradient-to-r from-violet-300 to-violet-200 bg-clip-text italic text-transparent">
          articulate
        </span>
      </h1>
      <p className="mt-4 max-w-xl text-gray-400">
        An <span className="italic text-amber-50">impromptu</span> speaking
        challenge that trains you to speak with{" "}
        <span className="italic text-violet-400">confidence</span>.
      </p>
      <Link
        to="/login"
        className="mt-8 rounded-full bg-violet-50 px-8 py-3 font-medium hover:bg-violet-100"
      >
        <span className="text-black">Try it free →</span>
      </Link>
      <img
        src={heroImg}
        alt="Speaking challenge"
        className="mx-auto mt-16 h-auto w-full max-w-3xl"
      />
    </section>
  );
}

/* ---------- How it works: preview visuals ---------- */

function TopicPreview() {
  const topics = ["Career", "Travel", "Random", "Opinion"];
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {topics.map((t, i) => (
        <span
          key={t}
          className={`rounded-full px-3 py-1 text-xs ${
            i === 2 ? "bg-violet-400 text-black" : "bg-white/10 text-gray-400"
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}

function WaveformPreview() {
  const heights = [8, 16, 24, 14, 28, 10, 20, 12, 18, 9];
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-2 shrink-0 rounded-full bg-red-400" />
      <div className="flex items-end gap-[3px]">
        {heights.map((h, i) => (
          <span
            key={i}
            className="w-[3px] rounded-full bg-violet-400"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function FeedbackPreview() {
  const rows = [
    { label: "Clarity", value: 82, color: "bg-violet-400" },
    { label: "Confidence", value: 68, color: "bg-amber-400" },
    { label: "Filler", value: 22, color: "bg-orange-500" },
  ];
  return (
    <div className="w-full space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-2 text-xs">
          <span className="w-16 shrink-0 text-gray-400">{r.label}</span>
          <div className="h-1.5 flex-1 rounded-full bg-white/10">
            <div
              className={`h-1.5 rounded-full ${r.color}`}
              style={{ width: `${r.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function StreakPreview() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const done = [true, true, true, false, false, false, false];
  return (
    <div className="flex items-center gap-1.5">
      {days.map((d, i) => (
        <div
          key={i}
          className={`flex h-7 w-7 items-center justify-center rounded-md text-[10px] ${
            done[i] ? "bg-violet-400 text-black" : "bg-white/10 text-gray-500"
          }`}
        >
          {d}
        </div>
      ))}
    </div>
  );
}

const PREVIEWS = [TopicPreview, WaveformPreview, FeedbackPreview, StreakPreview];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        How it <span className="font-serif italic text-violet-300">works</span>
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, i) => {
          const Preview = PREVIEWS[i];
          return (
            <div
              key={step.title}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5"
            >
              <div className="m-4 mb-0 flex h-28 items-center justify-center rounded-xl bg-black/30 px-4">
                <Preview />
              </div>
              <div className="flex flex-1 flex-col p-6 pt-4">
                <span className="font-serif text-sm italic text-violet-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-gray-400">{step.desc}</p>
                <span className="mt-4 text-[11px] tracking-wide text-gray-500">
                  {step.tag}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ---------- Speech coach demo ---------- */

function Transcript() {
  return (
    <p className="text-base leading-relaxed text-gray-200 sm:text-lg">
      {TRANSCRIPT_PARTS.map((part, i) => {
        if (part.k === "filler") {
          return (
            <span
              key={i}
              className="text-amber-400/90 underline decoration-amber-500/40 decoration-wavy underline-offset-4"
            >
              {part.t}
            </span>
          );
        }
        if (part.k === "emphasis") {
          return (
            <span key={i} className="font-semibold text-violet-300">
              {part.t}
            </span>
          );
        }
        return <span key={i}>{part.t}</span>;
      })}
    </p>
  );
}

function MetricCard({ label, sub, value, color, note }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-xs uppercase tracking-wide text-gray-500">
          {label}
          {sub ? ` · ${sub}` : ""}
        </span>
        <span className="text-xl font-semibold">{value}</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-white/10">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-gray-400">{note}</p>
    </div>
  );
}

function SpeechCoach() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        Your personal{" "}
        <span className="font-serif italic text-violet-300">speech coach</span>
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-gray-400">
        Watch the analysis unfold as the recording plays. No dashboards to dig
        through — feedback finds you.
      </p>

      <div className="mt-10 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="italic">Day 3 · Airplane mode</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs">
              Analyzed
            </span>
          </div>
          <div className="mt-6 font-mono text-sm text-gray-600">
            00:47 / 01:00
          </div>
          <div className="mt-3">
            <Transcript />
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 lg:w-80 lg:shrink-0">
          {METRICS.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>
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
          <div
            key={a.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center"
          >
            <h3 className="font-semibold">{a.title}</h3>
            <p className="mt-1 text-sm text-gray-400">{a.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PricingRow({ label, value, variant = "feature" }) {
  const valueClasses = {
    feature: "text-xs uppercase tracking-wide text-neutral-400",
  }[variant];
  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-900/10 py-3 text-sm">
      <span>{label}</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
}
 
function PricingCard({
  title,
  tag,
  regular,
  offer,
  features,
  cta,
  popular,
}) {
  const discount = Math.round(((regular - offer) / regular) * 100);
  return (
    <div className="relative">
      {popular && (
        <span className="absolute -top-3 right-6 z-10 -rotate-3 rounded-sm bg-rose-400 px-3 py-1.5 text-center text-[10px] font-semibold uppercase leading-tight text-rose-950 shadow-sm">
          Most
          <br />
          popular
        </span>
      )}
      <div className="rounded-t-2xl bg-[#F4F1EA] px-6 pt-10 text-neutral-900 sm:px-8">
        <h3 className="text-center font-serif text-2xl italic leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-center text-xs uppercase tracking-widest text-neutral-500">
          {tag}
        </p>
 
        <div className="mt-6 flex items-center justify-center gap-2 border-t border-neutral-900/10 pt-6">
          <span className="text-neutral-400 line-through">₹{regular}</span>
          <span className="font-serif text-3xl italic font-semibold">
            ₹{offer}
          </span>
        </div>
        <p className="text-center text-xs text-emerald-700">
          {discount}% off
        </p>
 
        <div className="mt-6 border-t border-neutral-900/10">
          {features.map((f) => (
            <PricingRow key={f} label={f} value="Incl." variant="feature" />
          ))}
        </div>
 
        <button
          type="button"
          className={` mt-6 flex w-full items-center justify-between rounded-full px-6 py-3 text-sm font-medium ${
            popular
              ? "bg-amber-400 text-amber-950 hover:bg-amber-300"
              : "bg-neutral-900 text-white hover:bg-neutral-800"
          }`}
        >
          <span>
            {cta} — ₹{offer}
          </span>
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div
        aria-hidden="true"
        className="h-4"
        style={{
          backgroundImage:
            "linear-gradient(135deg, #F4F1EA 50%, transparent 50.5%), linear-gradient(225deg, #F4F1EA 50%, transparent 50.5%)",
          backgroundSize: "16px 16px",
          backgroundPosition: "top",
          backgroundRepeat: "repeat-x",
        }}
      />
    </div>
  );
}
 
function Pricing() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h2 className="text-center text-2xl font-semibold sm:text-3xl">
        Join the{" "}
        <span className="font-serif italic text-violet-300">challenge</span>
      </h2>
      <p className="mx-auto mt-3 max-w-md text-center text-gray-400">
        Record for 60 seconds. Get AI-powered feedback on exactly what to improve.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 sm:items-start">
        {PLANS.map((p) => (
          <PricingCard key={p.title} {...p} />
        ))}
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
          <div
            key={f.q}
            className="rounded-xl border border-white/10 bg-white/5 p-5"
          >
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
  <footer className="border-t border-white/10 px-6 py-8 flex justify-center items-center">
  <img
    src={navImg}
    alt="GetRiff"
    className="w-60 sm:w-48 md:w-56 h-auto object-contain"
  />
</footer>
  );
}