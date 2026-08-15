import { useState } from "react";
import { Link } from "react-router-dom";
import Rabbit from "../assets/rabbit.png";
import LogoHorizontal from "../assets/Logo-horizontal.png";
import DocumentModal from "./DocumentModal";
import { legalPages } from "../data/legalPages";

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Courses", to: "/courses" }
];

const resourceLinks = [
  { label: "Return Policy", slug: "return-policy" },
  { label: "Refund Policy", slug: "refund-policy" },
  { label: "Privacy Policy", slug: "privacy-policy" },
  { label: "Terms & Conditions", slug: "terms-and-conditions" },
  { label: "Disclaimer", slug: "disclaimer" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact Us", slug: "contact" },
];

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M14 9h2.5V6.2h-2.2c-2.3 0-3.6 1.4-3.6 3.6V11H8.5v2.7h2.2V21H14v-7.3h2.3l.4-2.7H14v-1c0-.7.3-1 1-1Z" />
  </svg>
);

const InstagramIcon = () => (
  <a 
    href="https://instagram.com/developmentrabbit" 
    target="_blank" 
    rel="noopener noreferrer"
    aria-label="Instagram"
  >
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="4" y="4" width="16" height="16" rx="5" />
      <circle cx="12" cy="12" r="3.3" />
      <circle cx="16.6" cy="7.4" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  </a>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M8 10.5V17M8 7.5v.01M12.3 17v-3.8c0-1.4 1-2.3 2.3-2.3s2.2 1 2.2 2.3V17" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const socialIcons = [
  { label: "Instagram", Icon: InstagramIcon },
];

const Footer = () => {
  const [activeSlug, setActiveSlug] = useState(null);

  return (
    <footer className="bg-ink text-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.9fr_1.3fr] gap-10 lg:gap-8 pb-12">
          <div>
            <Link to="/" className="inline-flex items-center bg-white rounded-lg px-3 py-2 mb-4">
              <img src={LogoHorizontal} alt="Development Rabbit" className="h-7 w-auto" />
            </Link>
            <p className="font-body text-xs text-white/50 -mt-2 mb-4">Prompt Smart. Render Fast.</p>
            <p className="font-body text-sm text-white/50 max-w-xs">
              Hands-on AI video generation courses for creators, editors, and marketers worldwide.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm text-primary mb-4">Explore</h3>
            <ul className="flex flex-col gap-3 font-body text-sm">
              {exploreLinks.map(({ label, to, slug }) => (
                <li key={label}>
                  {to ? (
                    <Link to={to} className="hover:text-white transition-colors">
                      {label}
                    </Link>
                  ) : slug ? (
                    <button
                      type="button"
                      onClick={() => setActiveSlug(slug)}
                      className="hover:text-white transition-colors"
                    >
                      {label}
                    </button>
                  ) : (
                    <span className="cursor-default">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm text-primary mb-4">Resources</h3>
            <ul className="flex flex-col gap-3 font-body text-sm">
              {resourceLinks.map(({ label, href, slug }) => (
                <li key={label}>
                  {href ? (
                    <a href={href} className="hover:text-white transition-colors">
                      {label}
                    </a>
                  ) : slug ? (
                    <button
                      type="button"
                      onClick={() => setActiveSlug(slug)}
                      className="hover:text-white transition-colors"
                    >
                      {label}
                    </button>
                  ) : (
                    <span className="cursor-default">{label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold text-sm text-primary mb-4">Subscribe</h3>
            <p className="font-body text-sm text-white/50 mb-4">
              Join our newsletter to stay up to date on features and releases.
            </p>
            {/* No newsletter API yet — wire this up once one exists */}
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 min-w-0 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="shrink-0 bg-primary hover:opacity-90 transition-opacity text-white text-sm font-semibold px-5 py-2.5 rounded-full"
              >
                Subscribe
              </button>
            </form>
            <p className="font-body text-xs text-white/40 mt-4">
              By subscribing, you agree to with our{" "}
              <button
                type="button"
                onClick={() => setActiveSlug("privacy-policy")}
                className="text-primary font-medium hover:underline"
              >
                Privacy Policy
              </button>{" "}
              and provide consent to receive updates from our company.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-body text-xs text-white/50 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Development Rabbit. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {socialIcons.map(({ label, Icon }) => (
              <span
                key={label}
                aria-hidden="true"
                className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center"
              >
                <Icon />
              </span>
            ))}
          </div>

          <p className="flex items-center gap-1.5">
            Designed by
            <img src={Rabbit} alt="" aria-hidden="true" className="w-4 h-4 opacity-70" />
            <span className="text-primary font-medium">Development Rabbit</span>
          </p>
        </div>
      </div>

      {activeSlug && (
        <DocumentModal page={legalPages[activeSlug]} onClose={() => setActiveSlug(null)} />
      )}
    </footer>
  );
};

export default Footer;
