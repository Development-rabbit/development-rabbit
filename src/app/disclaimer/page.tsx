import type { Metadata } from "next";
import LegalPage from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "Important disclaimers regarding outcomes, third-party tools, and limitations of liability for Development Rabbit's website and services.",
};

export default function DisclaimerPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Disclaimer"
      lastUpdated="15 October 2026"
    >
      <h2>1. General Information Only</h2>
      <p>
        All content on this website — including service descriptions, case
        studies, and related resources — is provided for{" "}
        <strong>general informational purposes only</strong>. It does not
        constitute professional, financial, legal, or technical advice of any
        kind, and it does not create a client relationship. A binding
        engagement with Development Rabbit is formed only through a mutually
        agreed proposal or contract.
      </p>

      <h2>2. No Guaranteed Outcomes</h2>
      <p>
        We do not guarantee any specific results, revenue, growth, or business
        outcomes from the use of our services or the information on this
        website. Any examples, case studies, projections, or figures shared are
        for illustrative purposes only; actual results vary based on scope,
        market conditions, and many factors beyond our control.
      </p>

      <h2>3. Not Professional or Financial Advice</h2>
      <p>
        Nothing on this website constitutes financial, legal, tax, or
        professional business advice. You should consult a qualified
        professional before making financial or business decisions.
      </p>

      <h2>4. Third-Party Platforms and Tools</h2>
      <p>
        Our services may reference or rely on third-party tools and platforms
        (including cloud providers, AI tools, and social media platforms).
        These are owned and operated by third parties whose terms, pricing,
        availability, and policies may change at any time without our control.
        Development Rabbit is not affiliated with, endorsed by, or responsible
        for these third-party platforms.
      </p>

      <h2>5. External Links</h2>
      <p>
        Our website may contain links to third-party websites. We are not
        responsible for the content, accuracy, or practices of these external
        sites.
      </p>

      <h2>6. Accuracy of Information</h2>
      <p>
        While we strive to keep our content accurate and current, technology
        and platforms evolve quickly. We make no representation that all
        information is complete, current, or error-free, and we may update
        content at any time without notice.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, Development Rabbit shall not be
        liable for any direct, indirect, incidental, or consequential loss or
        damage arising from the use of our website, services, or related
        materials.
      </p>

      <h2>8. Contact</h2>
      <p>
        Questions about this Disclaimer can be sent to{" "}
        <a href="mailto:support@developmentrabbit.com">
          support@developmentrabbit.com
        </a>
        .
      </p>
    </LegalPage>
  );
}
