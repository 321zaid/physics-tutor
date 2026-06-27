import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy — Physics Teacher",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-bg pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Privacy Policy</h1>
        <p className="text-text-dim text-xs uppercase tracking-wider mb-10">Last updated: 26 June 2026</p>

        <div className="space-y-8 text-sm text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">1. Introduction</h2>
            <p>
              Physics Teacher (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data when you visit our website and use our services.
            </p>
            <p className="mt-3">
              We comply with the <strong>Personal Data Protection Act No. 9 of 2022</strong> of Sri Lanka and, where applicable, the General Data Protection Regulation (GDPR) of the European Union.
            </p>
            <p className="mt-3">
              If you have any questions, contact us at: <span className="text-text-primary">phys@teach.com</span>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">2. Data We Collect</h2>
            <p className="mb-2">We collect the following categories of personal data:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Identity Data:</strong> full name, email address, phone number</li>
              <li><strong>Academic Data:</strong> grade/board, curriculum, subject</li>
              <li><strong>Account Data:</strong> hashed password, role, access status, fee payment status</li>
              <li><strong>Usage Data:</strong> pages visited, time spent, interactions with the site</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device type, operating system</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">3. How We Collect Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Directly from you:</strong> when you fill in the sign-up form or contact us</li>
              <li><strong>Automatically:</strong> through cookies and analytics (Cloudflare Web Analytics)</li>
              <li><strong>From third parties:</strong> authentication data from Supabase Auth</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <p>If you are in the European Economic Area, we process your data under these legal bases:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Consent:</strong> you have given clear consent (e.g., cookie consent)</li>
              <li><strong>Contractual necessity:</strong> processing is necessary to provide our tutoring services to you</li>
              <li><strong>Legitimate interest:</strong> improving our teaching platform and ensuring security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">5. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To create and manage your student account</li>
              <li>To grant or deny access to live classes and course materials</li>
              <li>To communicate class schedules, changes, and administrative notices</li>
              <li>To process fee payments and manage records</li>
              <li>To improve our teaching platform and user experience</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">6. Data Sharing and Third Parties</h2>
            <p className="mb-2">We share your data only with essential service providers:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Supabase</strong> (database, authentication, storage) — United States servers</li>
              <li><strong>Cloudflare</strong> (CDN, DNS, Workers hosting) — global edge network</li>
              <li><strong>GitHub</strong> (source code repository) — does not receive user data</li>
            </ul>
            <p className="mt-3">We do <strong>not</strong> sell your personal data to third parties.</p>
            <p className="mt-2">
              <strong>International transfers:</strong> Your data is stored on Supabase servers in the United States. By using our service, you consent to this transfer.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">7. Data Retention</h2>
            <p>
              We retain your personal data for as long as your account is active or as needed to provide you with services. After account deletion or upon request, we delete your data within 30 days, except where we are legally required to retain it longer (e.g., for tax records of payments).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">8. Data Subject Rights</h2>
            <p className="mb-2">Under the Sri Lanka PDPA and GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Access</strong> your personal data</li>
              <li><strong>Correct</strong> inaccurate data</li>
              <li><strong>Delete</strong> your data (right to erasure)</li>
              <li><strong>Restrict</strong> processing of your data</li>
              <li><strong>Port</strong> your data to another service</li>
              <li><strong>Object</strong> to processing based on legitimate interests</li>
              <li><strong>Withdraw consent</strong> at any time</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at <span className="text-text-primary">phys@teach.com</span>. We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">9. Children&apos;s Privacy</h2>
            <p>
              Our services are directed at students, including minors under 18. If you are a parent or guardian and your child has provided us with personal data without your consent, please contact us. We will delete their data promptly. We require parental consent for students under 18 where required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">10. Cookies</h2>
            <p>
              We use only strictly necessary cookies for authentication (Supabase Auth session tokens) and Cloudflare Web Analytics for anonymous usage statistics. No advertising or tracking cookies are used.
            </p>
            <p className="mt-2">
              See our <a href="/cookies" className="text-text-primary underline hover:text-text-muted">Cookie Policy</a> for full details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">11. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>End-to-end encrypted connections (HTTPS/TLS)</li>
              <li>Row-Level Security (RLS) policies on all database tables</li>
              <li>Password hashing via Supabase Auth (bcrypt)</li>
              <li>Access control restricting admin functions to authorized users only</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">12. Data Breach Notification</h2>
            <p>
              In the event of a data breach that affects your personal data, we will notify you and the relevant supervisory authority within 72 hours of becoming aware of the breach, as required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">13. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">14. Contact</h2>
            <p>
              For privacy-related inquiries or to exercise your rights:
            </p>
            <p className="mt-2">
              Email: <span className="text-text-primary">phys@teach.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
