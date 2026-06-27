"use client"

const links = [
  { label: "About", href: "#about" },
  { label: "Topics", href: "#topics" },
  { label: "Method", href: "#method" },
  { label: "Results", href: "#results" },
  { label: "Join", href: "#join" },
]

const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
]

export function Footer() {
  return (
    <footer className="bg-bg-solid border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <span className="text-sm font-semibold text-text-primary tracking-super uppercase">
              Physics
            </span>
            <span className="text-[10px] text-text-muted tracking-extreme uppercase block mt-0.5">
              Teacher
            </span>
            <p className="text-sm text-text-muted mt-4 max-w-xs leading-relaxed">
              Exam-focused physics teaching that makes the subject finally
              make sense. Visual, structured, and clear.
            </p>
          </div>
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-4">
              Navigation
            </h4>
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-muted hover:text-text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-4">
              Legal
            </h4>
            <div className="space-y-2">
              {legal.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-text-muted hover:text-text-primary transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-text-dim mb-4">
              Contact
            </h4>
            <div className="space-y-2 text-sm text-text-muted">
              <p>phys@teach.com</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-xs text-text-dim">
            &copy; 2026 Physics Teacher. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
