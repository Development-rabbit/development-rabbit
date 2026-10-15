import type { Metadata } from "next";
import { AtSign, Clock, Mail, MapPin, Phone } from "lucide-react";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Development Rabbit — email, phone, business address, and support hours for project inquiries, payment support, and pre-sales questions.",
};

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: "support@developmentrabbit.com",
    href: "mailto:support@developmentrabbit.com",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+91 79035 76683",
    href: "tel:+917903576683",
  },
  {
    icon: MapPin,
    label: "Business Address",
    value: "Muslim Bazar, Giridih, Jharkhand – 815301, India",
    href: null,
  },
  {
    icon: Clock,
    label: "Support Hours",
    value: "Monday – Saturday, 10:00 AM – 6:00 PM IST",
    href: null,
  },
  {
    icon: AtSign,
    label: "Instagram",
    value: "@developmentrabbit",
    href: "https://www.instagram.com/developmentrabbit/",
  },
];

export default function ContactPage() {
  return (
    <LegalPage
      eyebrow="Get in touch"
      title="Contact Us"
      lastUpdated="15 October 2026"
    >
      <p>
        We&apos;d love to hear from you — whether it&apos;s a project inquiry,
        a question before you engage us, or help with an existing engagement or
        payment. Reach us through any of the channels below.
      </p>

      <div className="my-10 grid gap-4 sm:grid-cols-2">
        {channels.map((channel) => (
          <div
            key={channel.label}
            className="flex items-start gap-4 rounded-2xl border border-line bg-surface p-5 card-shadow"
          >
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent">
              <channel.icon size={18} />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted">
                {channel.label}
              </p>
              {channel.href ? (
                <a
                  href={channel.href}
                  {...(channel.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="mt-1 block break-words font-medium text-foreground no-underline hover:text-accent"
                >
                  {channel.value}
                </a>
              ) : (
                <p className="mt-1 font-medium text-foreground">
                  {channel.value}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <h2>Payment Support</h2>
      <p>
        For payment-related queries (invoice issues, refunds, failed or
        duplicate payments), please include your{" "}
        <strong>payment reference / invoice number</strong> in your message so
        we can assist you faster. Also see our{" "}
        <a href="/refund-policy">Cancellation & Refund Policy</a> and{" "}
        <a href="/shipping-policy">Shipping & Delivery Policy</a>.
      </p>

      <h2>Response Time</h2>
      <p>
        We typically reply within <strong>24–48 hours</strong> on business
        days.
      </p>
    </LegalPage>
  );
}
