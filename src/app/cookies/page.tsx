import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy — Physics Teacher",
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-bg pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">Cookie Policy</h1>
        <p className="text-text-dim text-xs uppercase tracking-wider mb-10">Last updated: 26 June 2026</p>

        <div className="space-y-8 text-sm text-text-muted leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device by your web browser. They help websites function properly and improve your browsing experience.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">2. Cookies We Use</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-border">
                <thead>
                  <tr className="border-b border-border bg-bg-alt">
                    <th className="p-3 text-left text-text-primary font-medium">Cookie</th>
                    <th className="p-3 text-left text-text-primary font-medium">Purpose</th>
                    <th className="p-3 text-left text-text-primary font-medium">Type</th>
                    <th className="p-3 text-left text-text-primary font-medium">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="p-3">sb-*-auth-token</td>
                    <td className="p-3">Supabase Auth session — keeps you logged in</td>
                    <td className="p-3">Strictly necessary</td>
                    <td className="p-3">Session / persistent</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="p-3">cookiesAccepted</td>
                    <td className="p-3">Remembers your cookie consent preference</td>
                    <td className="p-3">Strictly necessary</td>
                    <td className="p-3">Persistent (localStorage)</td>
                  </tr>
                  <tr>
                    <td className="p-3">_cfduid / __cf_bm</td>
                    <td className="p-3">Cloudflare security and performance</td>
                    <td className="p-3">Strictly necessary</td>
                    <td className="p-3">30 days / session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">3. Cloudflare Web Analytics</h2>
            <p>
              We use Cloudflare Web Analytics, a privacy-first analytics service that does not use cookies or collect personal data. It provides anonymous aggregate usage statistics.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">4. Your Choices</h2>
            <p>
              You can control cookies through your browser settings. Blocking strictly necessary cookies may prevent you from logging in or using core features of the site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">5. Changes</h2>
            <p>
              We may update this Cookie Policy. Changes will be posted here with an updated date.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-text-primary mb-3">6. Contact</h2>
            <p>
              Questions: <span className="text-text-primary">phys@teach.com</span>
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
