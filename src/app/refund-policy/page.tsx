import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy",
  description:
    "Cancellation and refund terms for Development Rabbit's development and technology services, including advance payments, milestones, and processing timelines.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Cancellation & Refund Policy"
      lastUpdated="15 October 2026"
    >
      <p>
        This policy explains the cancellation and refund terms for services
        engaged from Development Rabbit (&quot;we&quot;, &quot;us&quot;, or
        &quot;our&quot;) via{" "}
        <a href="https://developmentrabbit.com">
          https://developmentrabbit.com
        </a>
        . Please read it carefully before making a payment.
      </p>

      <h2>1. Scope</h2>
      <p>
        Development Rabbit provides <strong>services only</strong> — custom
        development and technology work delivered under an agreed proposal or
        contract. We do not sell physical goods, so there is nothing to ship or
        return. Because services involve allocation of our team&apos;s time and
        expertise, refunds are governed by the terms below rather than by
        product-return rules.
      </p>

      <h2>2. Cancellation by You</h2>
      <ul>
        <li>
          <strong>Before work begins:</strong> if you cancel before our team
          has commenced work on your engagement, any advance paid will be
          refunded in full.
        </li>
        <li>
          <strong>After work has begun:</strong> advance and milestone payments
          cover allocation of our team and work already performed, and are{" "}
          <strong>non-refundable</strong> once work has commenced.
        </li>
        <li>
          <strong>Mid-engagement cancellation:</strong> if you cancel an
          ongoing engagement, amounts corresponding to work already performed
          or in progress (pro-rated where applicable) remain payable. Any
          amount paid for milestones not yet started will be refunded.
        </li>
      </ul>

      <h2>3. Cancellation by Us</h2>
      <p>
        If we are unable to begin or complete an engagement for reasons on our
        side, we will refund any amounts paid for work not delivered — in full
        if work has not begun, or pro-rated to exclude completed milestones if
        the engagement is partially delivered.
      </p>

      <h2>4. Contract Terms Prevail</h2>
      <p>
        Where a signed proposal or contract for a specific engagement contains
        its own cancellation or refund terms, those terms prevail over this
        policy to the extent of any conflict.
      </p>

      <h2>5. Failed, Duplicate, or Erroneous Payments</h2>
      <p>
        If an amount was debited from your account without a corresponding
        confirmation, or you were charged more than once for the same payment,
        contact us with your payment reference. Verified failed or duplicate
        transactions will be refunded in full within{" "}
        <strong>5–7 business days</strong>.
      </p>

      <h2>6. How to Request a Refund</h2>
      <ol>
        <li>
          Email us at{" "}
          <a href="mailto:support@developmentrabbit.com">
            support@developmentrabbit.com
          </a>{" "}
          with your payment reference/invoice number and the reason for your
          request.
        </li>
        <li>
          Our team will review your request within{" "}
          <strong>2–3 business days</strong> and notify you of the outcome.
        </li>
        <li>
          If approved, refunds are processed to the original payment method via
          Razorpay within <strong>5–7 business days</strong>, subject to your
          bank&apos;s processing timelines.
        </li>
      </ol>
      <p>
        For payment-processing issues, you may also raise a concern through
        Razorpay directly.
      </p>

      <h2>7. Changes to This Policy</h2>
      <p>
        We may update this policy from time to time. Changes will be posted on
        this page with an updated &quot;Last updated&quot; date and apply to
        payments made after the change.
      </p>
    </LegalPage>
  );
}
