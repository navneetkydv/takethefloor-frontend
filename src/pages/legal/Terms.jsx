// src/pages/legal/TermsPage.jsx

import { useNavigate } from 'react-router-dom';

export function TermsPage() {
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

        <h1 className="mt-6 text-3xl font-semibold">Terms of Service</h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: August 2026</p>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-gray-300">
          <Section title="1. Acceptance of terms">
            By creating an account or using TakeTHEfloor ("the app", "we", "us"), you agree
            to these Terms of Service. If you don't agree, please don't use the app.
          </Section>

          <Section title="2. What we offer">
            TakeTHEfloor is a daily speaking-practice app. You're given a topic, you record
            a short response, and our system evaluates it for clarity, structure, and
            fluency. Access to recording and evaluation depends on your subscription status.
          </Section>

          <Section title="3. Accounts">
            You're responsible for keeping your account credentials secure and for all
            activity that happens under your account. Let us know right away if you suspect
            unauthorized access.
          </Section>

          <Section title="4. Subscriptions and payments">
            Paid plans are billed for the period you choose (e.g. 7-day or 30-day
            challenges) via Razorpay. There's no auto-renewal — you pay per period, on your
            terms. Prices are shown in INR at checkout before you pay.
          </Section>

          <Section title="5. Cancellations and refunds">
            Since plans don't auto-renew, there's nothing to "cancel" going forward — a plan
            simply expires at the end of its period. Refunds, where applicable, are handled
            on a case-by-case basis; contact us if something went wrong with a payment.
          </Section>

          <Section title="6. Acceptable use">
            Don't use the app to upload abusive, illegal, or harmful content, attempt to
            disrupt the service, or misuse the daily recording limits. We may suspend
            accounts that violate this.
          </Section>

          <Section title="7. Content you submit">
            You keep ownership of your recordings. By submitting a recording, you give us
            permission to process it (transcription, analysis) solely to generate your
            feedback.
          </Section>

          <Section title="8. Disclaimer">
            The app is provided "as is." AI-generated feedback is meant to help you
            practice — it isn't professional coaching advice, and we don't guarantee any
            specific outcome.
          </Section>

          <Section title="9. Changes to these terms">
            We may update these terms from time to time. Continued use of the app after a
            change means you accept the updated terms.
          </Section>

          <Section title="10. Contact">
            Questions about these terms? Reach out at{' '}
            <a href="mailto:support@getriff.app" className="underline hover:text-white">
              support@getriff.app
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