import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "How Development Rabbit delivers its development services — delivery methods, timelines, and what to do if a payment confirmation doesn't arrive.",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Shipping & Delivery Policy"
      lastUpdated="15 October 2026"
    >
      <p>
        This policy describes how services engaged from Development Rabbit
        (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) are delivered to
        you.
      </p>

      <h2>1. No Physical Shipping</h2>
      <p>
        Development Rabbit provides <strong>services only</strong> — custom
        software, AR/VR, AI, embedded systems, and web development. We do{" "}
        <strong>not sell or ship any physical goods</strong>, so no courier,
        shipping charges, or physical delivery timelines apply.
      </p>

      <h2>2. How Services Are Delivered</h2>
      <ul>
        <li>
          <strong>Delivery method:</strong> all deliverables are provided
          electronically — via code repositories, cloud/drive links, email, or
          deployment to your infrastructure, as agreed in the proposal.
        </li>
        <li>
          <strong>Delivery timeline:</strong> as per the{" "}
          <strong>timeline and milestones in the signed proposal</strong> for
          each engagement.
        </li>
        <li>
          <strong>Delivery charges:</strong> none — electronic delivery is
          free.
        </li>
      </ul>

      <h2>3. When Timelines Begin</h2>
      <ul>
        <li>
          Delivery timelines begin after receipt of the agreed advance payment
          and the inputs, approvals, and access required from you.
        </li>
        <li>
          Delays in receiving your inputs or approvals may extend delivery
          timelines proportionally.
        </li>
      </ul>

      <h2>4. Payment Confirmations and Issues</h2>
      <p>
        Payment confirmations and invoices are sent electronically to the
        email address you provide. If a payment was debited from your account
        but you did not receive a confirmation within 24 hours, contact us at{" "}
        <a href="mailto:support@developmentrabbit.com">
          support@developmentrabbit.com
        </a>{" "}
        with your payment reference. We will verify the transaction and resolve
        the issue within <strong>2–3 business days</strong>. Failed or
        duplicate payments are handled as per our{" "}
        <a href="/refund-policy">Cancellation & Refund Policy</a>.
      </p>

      <h2>5. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be posted on
        this page with an updated &quot;Last updated&quot; date.
      </p>
    </LegalPage>
  );
}
