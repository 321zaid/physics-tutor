import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service — Physics Teacher",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-bg pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Terms of Service</h1>
        <p className="text-text-dim text-xs uppercase tracking-wider mb-10">Last updated: 26 June 2026</p>

        <div className="space-y-8 text-sm text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Physics Teacher website and services, you agree to be bound by these Terms of Service. If you do not agree, do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">2. Description of Service</h2>
            <p>
              Physics Teacher provides online physics tutoring, live classes, recorded sessions, and supplementary educational materials. All services are provided on an &quot;as is&quot; basis.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>You must provide accurate and complete information when creating an account</li>
              <li>You are responsible for maintaining the confidentiality of your password</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
              <li>Account access is subject to approval by the teacher</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">4. Payment and Fees</h2>
            <p>
              Fees for tutoring services are communicated separately. Payment must be made according to the agreed schedule. Failure to pay may result in suspension of access to live classes and materials.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">5. Code of Conduct</h2>
            <p className="mb-2">Users agree to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Not share class meeting links with unauthorized persons</li>
              <li>Not record or distribute class sessions without permission</li>
              <li>Not engage in disruptive behavior during live classes</li>
              <li>Not attempt to access other users&apos; accounts or data</li>
              <li>Not use the platform for any unlawful purpose</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">6. Intellectual Property</h2>
            <p>
              All materials provided through the service, including but not limited to lesson content, slides, recordings, and worksheets, are the intellectual property of Physics Teacher. You may not reproduce, distribute, or create derivative works without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">7. Limitation of Liability</h2>
            <p>
              Physics Teacher is not liable for any indirect, incidental, or consequential damages arising from your use of the service. Our total liability is limited to the amount you have paid us in the past six months.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">8. Termination</h2>
            <p>
              We may terminate or suspend your account at any time for violation of these terms. You may delete your account at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">9. Governing Law</h2>
            <p>
              These terms are governed by the laws of Sri Lanka. Any disputes shall be resolved in the courts of Sri Lanka.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">10. Contact</h2>
            <p>
              For questions about these terms, contact: <span className="text-text-primary">phys@teach.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
