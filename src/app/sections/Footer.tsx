"use client";

import Logo from "../components/Logo";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Company: [
    { label: "About Us", href: "/#about" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/contact" },
    { label: "LinkedIn", href: "#" },
  ],
  Services: [
    { label: "AR Development", href: "/#services" },
    { label: "VR Development", href: "/#services" },
    { label: "Web Development", href: "/#services" },
    { label: "Consulting", href: "/#services" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Cancellation & Refunds", href: "/refund-policy" },
    { label: "Shipping & Delivery", href: "/shipping-policy" },
    { label: "Disclaimer", href: "/disclaimer" },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    label: "Ig",
    url: "https://www.instagram.com/developmentrabbit/",
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-line pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Logo variant="wordmark" className="h-10 w-auto mb-6" />
            <p className="text-muted max-w-sm leading-relaxed mb-6">
              We turn time into immersive digital experiences. A premium agency
              for AR, VR, and Web development.
            </p>
            <a
              href="mailto:support@developmentrabbit.com"
              className="text-foreground hover:text-accent transition-colors font-medium"
            >
              support@developmentrabbit.com
            </a>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-bold mb-5">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-muted hover:text-foreground transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
  <h4 className="font-display font-bold mb-5">Let&apos;s Connect</h4>
  <div className="flex gap-4">
    {socialLinks.map((social) => (
      <a
        key={social.name}
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full bg-white border border-line flex items-center justify-center text-sm font-semibold text-muted hover:bg-accent hover:text-white hover:border-accent transition-colors"
      >
        {social.label}
      </a>
    ))}
  </div>
</div></div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-line">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} Development Rabbit. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted">
            <a
              href="/privacy-policy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="/terms-and-conditions"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
