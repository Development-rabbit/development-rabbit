import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Development Rabbit collects, uses, stores, and protects your personal information when you use our website or engage our development services.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Privacy Policy"
      lastUpdated="15 October 2026"
    >
      <p>
        Development Rabbit (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;)
        operates the website{" "}
        <a href="https://developmentrabbit.com">
          https://developmentrabbit.com
        </a>{" "}
        (the &quot;Website&quot;). We provide software development and
        technology services, including AR/VR, AI, embedded systems, and web
        development. This Privacy Policy explains how we collect, use,
        disclose, and protect your personal information when you visit our
        Website or engage our services.
      </p>
      <p>
        By using our Website or providing us your information, you agree to the
        practices described in this Privacy Policy. If you do not agree, please
        do not use the Website.
      </p>

      <h2>1. Information We Collect</h2>
      <h3>1.1 Information you provide directly</h3>
      <ul>
        <li>
          <strong>Contact details:</strong> name, email address, and phone
          number when you fill out a form, book a call, or contact us.
        </li>
        <li>
          <strong>Billing details:</strong> billing name, email address, phone
          number, and billing address provided when you engage our services or
          pay an invoice.
        </li>
        <li>
          <strong>Project information:</strong> requirements, materials, and
          other information you share with us in the course of an engagement.
        </li>
        <li>
          <strong>Communication data:</strong> any information you share with
          us via email, WhatsApp, contact forms, or social media.
        </li>
      </ul>
      <h3>1.2 Information collected automatically</h3>
      <ul>
        <li>
          <strong>Usage data:</strong> pages visited, time spent, links
          clicked, and interactions with the Website.
        </li>
        <li>
          <strong>Device data:</strong> browser type, operating system, device
          type, IP address, and approximate location derived from it.
        </li>
        <li>
          <strong>Cookies and similar technologies:</strong> used for
          preferences, analytics, and advertising measurement (see Section 5).
        </li>
      </ul>
      <h3>1.3 Payment information</h3>
      <p>
        All payments to us are processed securely by our payment gateway
        partner, <strong>Razorpay</strong>. Your card, UPI, net-banking, and
        wallet details are entered directly on Razorpay&apos;s
        PCI-DSS-compliant infrastructure.{" "}
        <strong>
          We do not store, process, or have access to your complete card
          numbers, UPI PINs, or banking credentials on our servers.
        </strong>{" "}
        We only receive transaction confirmation details (such as payment ID,
        amount, and status) required to reconcile your payment.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>
          To provide, manage, and deliver the development services you engage
          us for.
        </li>
        <li>
          To prepare proposals, quotations, statements of work, and contracts.
        </li>
        <li>
          To send invoices, payment receipts, and transactional communication.
        </li>
        <li>To respond to your queries and provide customer support.</li>
        <li>
          To send occasional updates, offers, or marketing communication (you
          may opt out at any time).
        </li>
        <li>To improve our Website, services, and user experience.</li>
        <li>
          To detect and prevent fraud, abuse, and security incidents.
        </li>
        <li>
          To comply with applicable legal, tax (including GST), and accounting
          obligations.
        </li>
      </ul>

      <h2>3. How We Share Your Information</h2>
      <p>
        We do not sell or rent your personal information. We share limited data
        with trusted third parties strictly to operate our business:
      </p>
      <ul>
        <li>
          <strong>Razorpay</strong> — for secure payment processing and refund
          handling.
        </li>
        <li>
          <strong>Email and communication platforms</strong> — to send
          proposals, invoices, payment confirmations, and support responses.
        </li>
        <li>
          <strong>Analytics and advertising tools</strong> (e.g. Google
          Analytics, Meta Pixel) — to understand Website traffic and measure ad
          performance.
        </li>
        <li>
          <strong>Professional advisers and authorities</strong> — where
          required for legal, tax, regulatory, or audit compliance, or to
          enforce our rights.
        </li>
      </ul>
      <p>
        These providers receive only the data necessary to perform their
        function and are bound by their own privacy and security obligations.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain personal information only for as long as necessary to fulfil
        the purposes described in this policy — including engagement delivery,
        support, and warranty periods — and to comply with legal, tax, and
        accounting requirements under applicable Indian law. When data is no
        longer required, it is securely deleted or anonymised.
      </p>

      <h2>5. Cookies</h2>
      <p>
        Our Website uses cookies and similar technologies to remember your
        preferences, keep sessions secure, analyse traffic, and measure
        advertising (including from Instagram/Meta ads). You can disable
        cookies in your browser settings; however, some features of the Website
        may not function correctly as a result.
      </p>

      <h2>6. Data Security</h2>
      <p>
        We implement reasonable technical and organisational measures —
        including HTTPS encryption, access controls, and use of PCI-DSS
        compliant payment processing — to protect your information against
        unauthorised access, alteration, disclosure, or destruction. However,
        no method of transmission over the internet is 100% secure, and we
        cannot guarantee absolute security.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Subject to applicable law (including the Digital Personal Data
        Protection Act, 2023), you may:
      </p>
      <ul>
        <li>Request access to the personal data we hold about you.</li>
        <li>Request correction of inaccurate or incomplete data.</li>
        <li>
          Request erasure of your personal data, subject to legal retention
          requirements.
        </li>
        <li>Withdraw consent for marketing communication at any time.</li>
        <li>Raise a grievance about how your data has been handled.</li>
      </ul>
      <p>
        To exercise any of these rights, write to us at{" "}
        <a href="mailto:support@developmentrabbit.com">
          support@developmentrabbit.com
        </a>
        . You may also unsubscribe from marketing emails using the link provided
        in those emails.
      </p>

      <h2>8. Grievance Officer</h2>
      <p>
        In accordance with the Information Technology Act, 2000 and the rules
        made thereunder, the contact details of our Grievance Officer are:
      </p>
      <ul>
        <li>
          <strong>Name:</strong> Grievance Officer, Development Rabbit
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@developmentrabbit.com">
            support@developmentrabbit.com
          </a>
        </li>
        <li>
          <strong>Response time:</strong> We aim to acknowledge grievances
          within 48 hours and resolve them within 30 days.
        </li>
      </ul>

      <h2>9. Children&apos;s Privacy</h2>
      <p>
        Our Website and services are intended for users aged 18 and above. We
        do not knowingly collect personal information from children. If you
        believe a child has provided us personal data, contact us and we will
        delete it.
      </p>

      <h2>10. Third-Party Links</h2>
      <p>
        Our Website may contain links to third-party websites or platforms. We
        are not responsible for the privacy practices or content of those
        sites, and we encourage you to read their privacy policies.
      </p>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated &quot;Last updated&quot; date.
        Continued use of the Website after changes are posted constitutes
        acceptance of the revised policy.
      </p>

      <h2>12. Contact Us</h2>
      <p>
        For any questions about this Privacy Policy or our data practices,
        contact us at:
      </p>
      <ul>
        <li>
          <strong>Email:</strong>{" "}
          <a href="mailto:support@developmentrabbit.com">
            support@developmentrabbit.com
          </a>
        </li>
        <li>
          <strong>Website:</strong>{" "}
          <a href="https://developmentrabbit.com">
            https://developmentrabbit.com
          </a>
        </li>
      </ul>
    </LegalPage>
  );
}
