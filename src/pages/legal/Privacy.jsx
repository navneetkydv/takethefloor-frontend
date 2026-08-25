// src/pages/legal/PrivacyPage.jsx

import { useNavigate } from 'react-router-dom';

export function PrivacyPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          ← Back
        </button>

        <h1 className="mt-6 text-3xl font-semibold">Privacy Policy</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: August 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-300">
          <Section title="1. What we collect">
            When you sign in with Google, we receive your name, email, and profile photo.
            When you use the app, we store your recordings, transcripts, and the feedback
            generated from them, along with basic usage data (session activity, plan
            status).
          </Section>

          <Section title="2. How we use it">
            Your recordings are transcribed and analyzed purely to generate your feedback —
            clarity, filler words, structure, and similar scores. We use your account and
            usage data to run the app, enforce daily practice limits, and manage your
            subscription.
          </Section>

          <Section title="3. Recordings are private">
            Your recordings are stored privately and are only used to generate your own
            feedback. We don't share them publicly or use them to train models on other
            users' behalf.
          </Section>

          <Section title="4. Payments">
            Payments are processed by Razorpay. We don't store your card, UPI, or full
            payment details ourselves — Razorpay handles that in line with their own
            security standards.
          </Section>

          <Section title="5. Third parties">
            We share data only with the services needed to run the app: our authentication
            provider (Google), our payment processor (Razorpay), and any transcription/AI
            services used to generate your feedback. We don't sell your data.
          </Section>

          <Section title="6. Data retention">
            We keep your recordings and feedback for as long as your account is active, so
            you can track progress over time. You can request deletion of your account and
            associated data at any time.
          </Section>

          <Section title="7. Your choices">
            You can request a copy of your data or ask us to delete your account and
            recordings by contacting us. Deleting your account removes your recordings and
            feedback history.
          </Section>

          <Section title="8. Changes to this policy">
            We may update this policy from time to time. Meaningful changes will be
            reflected here with an updated date.
          </Section>

          <Section title="9. Contact">
            Questions about your data? Reach out at{' '}
            <a href="mailto:support@getriff.app" className="underline hover:text-white">
              takeupthefloor@gmail.com
            </a>
            .
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section>
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-2">{children}</p>
    </section>
  );
}