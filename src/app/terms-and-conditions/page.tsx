import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms that govern your use of the Development Rabbit website and your engagement of our development and technology services.",
};

export default function TermsAndConditionsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Terms & Conditions"
      lastUpdated="15 October 2026"
    >
      <p>
        These Terms & Conditions (&quot;Terms&quot;) govern your use of{" "}
        <a href="https://developmentrabbit.com">
          https://developmentrabbit.com
        </a>{" "}
        (the &quot;Website&quot;) and your engagement of services from
        Development Rabbit (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;).
        By accessing the Website or engaging our services, you agree to be
        bound by these Terms. If you do not agree, please do not use the
        Website or engage us.
      </p>

      <h2>1. About Our Services</h2>
      <p>
        Development Rabbit is a technology services agency. We provide custom
        development and related services, including:
      </p>
      <ul>
        <li>AR/VR development</li>
        <li>AI agents and applied AI solutions</li>
        <li>Embedded systems development</li>
        <li>Web development</li>
        <li>
          Software consultancy and related optimization and compliance support
          services
        </li>
      </ul>
      <p>
        Each engagement is delivered under a mutually agreed proposal,
        statement of work, or contract.
      </p>

      <h2>2. Eligibility</h2>
      <p>
        You must be at least 18 years old and capable of entering a legally
        binding contract under applicable law to engage our services. You agree
        to provide accurate, current, and complete information when contacting
        us or making a payment, and to keep it updated.
      </p>

      <h2>3. Quotations, Pricing and Payments</h2>
      <ul>
        <li>
          All services are quoted individually per engagement in a written
          proposal or invoice, based on scope, timelines, and deliverables.
        </li>
        <li>
          All prices are quoted in <strong>Indian Rupees (INR)</strong> and are
          exclusive of GST unless stated otherwise. Applicable taxes are
          charged as per prevailing law.
        </li>
        <li>
          Payments are processed securely through <strong>Razorpay</strong>. By
          making a payment, you also agree to Razorpay&apos;s terms and
          policies.
        </li>
        <li>
          Advance and milestone payments are due as specified in the agreed
          proposal. An engagement is confirmed only after successful payment
          authorisation of the agreed advance.
        </li>
        <li>
          We reserve the right to refuse or cancel any engagement or payment in
          cases of suspected fraud or payment failure — in which case any
          amount paid for undelivered work will be refunded to the original
          payment method.
        </li>
      </ul>

      <h2>4. Service Delivery</h2>
      <ul>
        <li>
          Deliverables are provided electronically (via repositories, cloud
          links, email, or deployment as agreed) according to the timeline and
          milestones in the agreed proposal. See our{" "}
          <a href="/shipping-policy">Shipping & Delivery Policy</a>.
        </li>
        <li>
          Delivery timelines begin after receipt of the agreed advance payment
          and the inputs, approvals, and access required from you.
        </li>
      </ul>

      <h2>5. Engagement Terms</h2>
      <ul>
        <li>
          Each engagement is governed by its own proposal/statement of work,
          which prevails over these Terms to the extent of any conflict.
        </li>
        <li>
          You agree to provide timely inputs, approvals, content, and access
          reasonably required for us to perform. Delays in inputs may extend
          delivery timelines proportionally.
        </li>
        <li>
          Reasonable revisions within the agreed scope are accommodated as per
          the proposal; changes outside the agreed scope may require a revised
          quotation and timeline.
        </li>
        <li>
          Unless otherwise agreed in writing, intellectual property in the
          final deliverables transfers to you upon receipt of full payment. We
          retain the right to reuse general know-how, tools, and
          non-confidential components developed during the engagement.
        </li>
      </ul>

      <h2>6. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Use the Website or our deliverables for any unlawful purpose or in
          violation of any applicable law.
        </li>
        <li>
          Copy, scrape, reverse-engineer, or commercially exploit the Website
          or its content without written permission.
        </li>
        <li>
          Attempt to gain unauthorised access to our systems, or interfere
          with the Website&apos;s operation or security.
        </li>
        <li>
          Misrepresent your identity or payment information, or use stolen or
          unauthorised payment instruments.
        </li>
      </ul>

      <h2>7. Intellectual Property</h2>
      <p>
        All content on the Website — including text, graphics, logos, videos,
        and code — is the property of Development Rabbit or its licensors and
        is protected by Indian and international intellectual property laws.
        Except as expressly agreed for engagement deliverables, no rights are
        granted to you.
      </p>

      <h2>8. Third-Party Tools and Platforms</h2>
      <p>
        Our services may reference or rely on third-party tools and platforms
        (for example, Razorpay, cloud providers, analytics providers, and AI
        tools). These are owned and operated by third parties whose terms,
        pricing, and availability may change without notice. We are not
        affiliated with, endorsed by, or responsible for such third parties.
      </p>

      <h2>9. Cancellations and Refunds</h2>
      <p>
        Cancellations and refunds are governed by our{" "}
        <a href="/refund-policy">Cancellation & Refund Policy</a>, which forms
        part of these Terms.
      </p>

      <h2>10. Disclaimers and Limitation of Liability</h2>
      <ul>
        <li>
          The Website and its content are provided on an &quot;as is&quot; and
          &quot;as available&quot; basis without warranties of any kind,
          express or implied.
        </li>
        <li>
          Any examples, projections, or case studies shared on the Website are
          for informational purposes only; we do not guarantee any specific
          business results or outcomes from our services. See our{" "}
          <a href="/disclaimer">Disclaimer</a>.
        </li>
        <li>
          To the maximum extent permitted by law, our aggregate liability for
          any claim arising out of an engagement shall not exceed the fees you
          paid us for that engagement.
        </li>
        <li>
          We are not liable for indirect, incidental, special, or consequential
          damages, or for loss of profits, data, or goodwill.
        </li>
      </ul>

      <h2>11. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless Development Rabbit from any
        claims, losses, liabilities, and expenses (including reasonable legal
        fees) arising from your breach of these Terms, misuse of the Website or
        our deliverables, or violation of any law or third-party rights.
      </p>

      <h2>12. Termination</h2>
      <p>
        We may suspend or terminate an engagement or your access to the Website
        if you breach these Terms or engage in fraudulent activity. Amounts for
        work already performed remain payable; refunds, if any, are handled as
        per our <a href="/refund-policy">Cancellation & Refund Policy</a>.
        Provisions that by their nature should survive termination — including
        intellectual property, disclaimers, limitation of liability, and
        governing law — shall survive.
      </p>

      <h2>13. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by the laws of India. Any dispute arising out
        of or relating to these Terms shall be subject to the exclusive
        jurisdiction of the courts at Giridih, Jharkhand, India. We encourage you to contact us first so we can attempt to
        resolve any dispute amicably.
      </p>

      <h2>14. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. Changes take effect when
        posted on this page with an updated &quot;Last updated&quot; date.
        Continued use of the Website after changes are posted constitutes
        acceptance of the revised Terms.
      </p>

      <h2>15. Contact Us</h2>
      <p>
        For questions about these Terms, contact us at{" "}
        <a href="mailto:support@developmentrabbit.com">
          support@developmentrabbit.com
        </a>{" "}
        or visit our <a href="/contact">Contact page</a>.
      </p>
    </LegalPage>
  );
}
