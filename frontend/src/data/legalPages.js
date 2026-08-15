// Content sourced from public/development-rabbit-website-pages.md, with
// [bracketed] placeholders resolved to concrete values. Edit here (not the
// markdown file) to change what renders in the footer document modals.

const p = (text) => ({ type: "p", text });
const h3 = (text) => ({ type: "h3", text });
const ul = (items) => ({ type: "ul", items });

export const legalPages = {
  "return-policy": {
    title: "Return Policy",
    lastUpdated: "August 14, 2026",
    blocks: [
      p(
        'Development Rabbit ("we," "us," "our") sells digital products, including the online course **Prompt to Profit: The AI Video Creator Blueprint** and the digital add-on **The Prompt Vault**. All products offered on this website are delivered electronically and are not physical goods.'
      ),
      p(
        "Because our products are digital and delivered instantly upon purchase, we do not accept returns in the traditional sense — there is no physical item to send back. Once a purchase is completed, access to the course or download link for the digital product is granted to the registered email/account."
      ),
      p(
        "If you experience an issue with accessing your purchase, made a duplicate purchase, or believe you were charged in error, please see our Refund Policy or contact us at **support@developmentrabbit.com** within 7 days of purchase."
      ),
    ],
  },

  "refund-policy": {
    title: "Refund Policy",
    lastUpdated: "August 14, 2026",
    blocks: [
      p("We want you to be satisfied with your purchase. Please read the terms below carefully before buying."),
      h3("Eligibility for Refund"),
      ul([
        "You may request a refund within 7 days of the date of purchase, provided you have accessed or consumed less than 20% of the course content.",
        "Refund requests made after this window, or after substantial completion of the course, will not be entertained.",
        'The Prompt Vault (digital PDF) is non-refundable once downloaded, as the file cannot be "returned."',
      ]),
      h3("Non-Refundable Circumstances"),
      ul([
        "Change of mind after significant course consumption.",
        "Failure to achieve specific personal or financial results — this course is educational content and does not guarantee outcomes (see our Disclaimer).",
        "Issues arising from your own device, internet connectivity, or third-party platforms (e.g. Instagram, Google Veo) that are outside our control.",
        "Accounts found to be sharing paid access or course material in violation of our Terms.",
      ]),
      h3("How to Request a Refund"),
      ul([
        "Email us at support@developmentrabbit.com with your order ID/payment reference and the reason for your request.",
        "Our team will review your request within 2–3 business days.",
        "If approved, refunds are processed to your original payment method via Razorpay within 5–7 business days, subject to your bank's processing timelines.",
      ]),
      h3("Failed or Duplicate Payments"),
      p(
        "If an amount was debited from your account but course access was not granted, or you were charged more than once for the same order, contact us with your payment reference — it will be resolved or refunded within 5–7 business days."
      ),
      p(
        "For any refund-related dispute, you may also raise a concern through Razorpay directly if the issue is payment-processing related."
      ),
    ],
  },

  "privacy-policy": {
    title: "Privacy Policy",
    lastUpdated: "August 14, 2026",
    blocks: [
      p(
        'Development Rabbit ("we," "us," "our") operates this website at **developmentrabbit.com**. This Privacy Policy explains how we collect, use, and protect your information when you visit our site or purchase our products.'
      ),
      h3("Information We Collect"),
      ul([
        "Personal details you provide at checkout: name, email address, phone number.",
        "Payment information, processed securely by our payment partner, Razorpay. We do not store your card, UPI, or bank details on our servers.",
        "Usage data — pages visited, device/browser type, and interactions with our website — collected via cookies and analytics tools.",
        "Communication data, including anything you share when contacting us via email, WhatsApp, or contact forms.",
      ]),
      h3("How We Use Your Information"),
      ul([
        "To process orders and grant access to purchased courses and digital products.",
        "To send order confirmations, course access details, and customer support responses.",
        "To send occasional updates, offers, or marketing communications (you may opt out anytime).",
        "To improve our website, course content, and user experience.",
        "To comply with legal and tax obligations.",
      ]),
      h3("Third-Party Services"),
      p("We share limited data with trusted third parties strictly to operate our business:"),
      ul([
        "Razorpay — for secure payment processing.",
        "Email and marketing platforms — for sending course access and updates.",
        "Analytics tools such as Google Analytics and Meta Pixel — to understand website traffic and ad performance.",
      ]),
      p(
        "These providers only receive the data necessary to perform their function and are bound by their own privacy and security obligations."
      ),
      h3("Cookies"),
      p(
        "Our website uses cookies to remember your preferences, keep you logged in, and measure traffic from advertising (e.g. Instagram/Meta ads). You can disable cookies in your browser settings, though some site features may not work correctly."
      ),
      h3("Data Security"),
      p(
        "We take reasonable technical and organizational measures to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
      ),
      h3("Your Rights"),
      p(
        "You may request access to, correction of, or deletion of your personal data by writing to **support@developmentrabbit.com**. You may also unsubscribe from marketing emails at any time using the link provided in those emails."
      ),
      h3("Changes to This Policy"),
      p(
        'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.'
      ),
      h3("Contact"),
      p("Questions about this policy can be sent to **support@developmentrabbit.com**."),
    ],
  },

  "terms-and-conditions": {
    title: "Terms & Conditions",
    lastUpdated: "August 14, 2026",
    blocks: [
      p(
        'These Terms & Conditions ("Terms") govern your access to and use of this website and the digital products sold on it, including the course **Prompt to Profit: The AI Video Creator Blueprint** and the digital add-on **The Prompt Vault**, operated by Development Rabbit ("we," "us," "our"). By browsing this site, creating an account, or purchasing a product, you agree to these Terms — please read them before buying.'
      ),
      h3("Eligibility"),
      p(
        "You must be at least 18 years old, or have a parent or guardian's consent, to purchase from us. By using this site you confirm that you're legally able to enter into a binding contract under applicable law."
      ),
      h3("Your Account"),
      ul([
        "You're responsible for the accuracy of the information you provide when registering, and for keeping your login credentials confidential.",
        "You're responsible for all activity that happens under your account, whether or not you personally performed it.",
        "Notify us immediately at support@developmentrabbit.com if you suspect unauthorized access to your account.",
      ]),
      h3("Course Access & License"),
      p(
        "When you purchase a course or digital product, we grant you a limited, non-exclusive, non-transferable license to access and use it for your own personal, non-commercial learning. This license does not give you ownership of the content itself."
      ),
      ul([
        "You may not share, resell, sublicense, or redistribute your account access, course videos, downloads, or prompt libraries to anyone else.",
        "You may not download, record, or repurpose course videos for use outside this platform, except where a downloadable file (like The Prompt Vault) is explicitly provided for that purpose.",
        "Accounts found sharing paid access or course material may be suspended or terminated without a refund, in addition to any other remedies available to us.",
      ]),
      h3("Acceptable Use"),
      p("When using this site, you agree not to:"),
      ul([
        "Attempt to gain unauthorized access to any part of the site, other users' accounts, or our systems.",
        "Scrape, copy, or reproduce site content or course material for any purpose other than your own learning.",
        "Upload or submit reviews, comments, or other content that is unlawful, abusive, defamatory, or infringes on someone else's rights.",
        "Use the site in any way that could disable, overburden, or impair its functionality.",
      ]),
      h3("Intellectual Property"),
      p(
        "All course content, videos, text, graphics, logos, and the Development Rabbit name and branding are owned by us or our licensors and are protected by copyright and other intellectual property laws. Nothing in these Terms transfers any of that ownership to you."
      ),
      p(
        "If you submit a review, comment, or other content on the site, you grant us a non-exclusive, royalty-free license to use, display, and reproduce it in connection with operating and promoting our business."
      ),
      h3("Payments & Pricing"),
      ul([
        "All prices are listed in INR unless stated otherwise and are processed securely through our payment partner, Razorpay.",
        "We may change course pricing at any time; the price you paid at checkout is the price that applies to your purchase.",
        "Refunds are handled per our separate Refund Policy and Return Policy.",
      ]),
      h3("Third-Party Tools & Platforms"),
      p(
        "Our courses teach the use of third-party AI and social media tools (such as Runway, Sora, Pika, Kling, and Instagram). These platforms are owned and operated independently of us, and their availability, pricing, and terms of service can change at any time without our control. We are not responsible for third-party platforms — see our Disclaimer for more detail."
      ),
      h3("Termination"),
      p(
        "We may suspend or terminate your access to the site or your purchased content, without notice, if we reasonably believe you've violated these Terms — including sharing access, abusive conduct, or fraudulent payment activity. Sections of these Terms that by their nature should survive termination (such as intellectual property and limitation of liability) will continue to apply."
      ),
      h3("Disclaimer & Limitation of Liability"),
      p(
        "Our courses and digital products are provided for educational purposes and are offered \"as is,\" without guarantees of specific results — see our Disclaimer for full details. To the maximum extent permitted by law, Development Rabbit is not liable for any indirect, incidental, or consequential loss arising from your use of this site or our products."
      ),
      h3("Governing Law"),
      p(
        "These Terms are governed by the laws of India. Any disputes arising out of or relating to these Terms or your use of the site will be subject to the exclusive jurisdiction of the courts of India."
      ),
      h3("Changes to These Terms"),
      p(
        'We may update these Terms from time to time to reflect changes to our products or legal requirements. Changes will be posted on this page with an updated "Last updated" date, and continued use of the site after a change means you accept the updated Terms.'
      ),
      h3("Contact"),
      p("Questions about these Terms can be sent to **support@developmentrabbit.com**."),
    ],
  },

  disclaimer: {
    title: "Disclaimer",
    lastUpdated: "August 14, 2026",
    blocks: [
      h3("Educational Purpose Only"),
      p(
        "All content provided by Development Rabbit, including the course **Prompt to Profit: The AI Video Creator Blueprint** and **The Prompt Vault**, is created for educational and informational purposes only. It is intended to teach concepts, tools, and techniques related to AI-generated video content creation."
      ),
      h3("No Guaranteed Results or Income"),
      p(
        "We do not guarantee any specific results, income, follower growth, or business outcomes from applying the strategies taught in our course. Any examples, case studies, or figures shared are for illustrative purposes only and reflect individual experiences, which will vary based on effort, market conditions, platform algorithms, and factors beyond our control. Your results may differ significantly."
      ),
      h3("Not Professional or Financial Advice"),
      p(
        "Nothing on this website or in our course constitutes financial, legal, tax, or professional business advice. You should consult a qualified professional before making financial or business decisions."
      ),
      h3("Third-Party Platforms and Tools"),
      p(
        "Our course references and relies on third-party tools and platforms, including but not limited to Google Veo, Instagram, and other AI and social media tools. These platforms are owned and operated by third parties whose terms, pricing, availability, and policies may change at any time without our control. Development Rabbit is not affiliated with, endorsed by, or responsible for these third-party platforms."
      ),
      h3("External Links"),
      p(
        "Our website or course material may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites."
      ),
      h3("Limitation of Liability"),
      p(
        "To the maximum extent permitted by law, Development Rabbit shall not be liable for any direct, indirect, incidental, or consequential loss or damage arising from the use of our website, course, or related materials."
      ),
    ],
  },

  about: {
    title: "About Us",
    lastUpdated: null,
    blocks: [
      p(
        "**Development Rabbit** is an ed-tech venture focused on making AI content creation accessible and practical for everyday creators."
      ),
      p(
        "We built **Prompt to Profit: The AI Video Creator Blueprint** to teach people — step by step — how to use AI video generation tools to create engaging, professional-quality content, from understanding the fundamentals of prompting to publishing and growing on platforms like Instagram. Alongside the main course, we offer **The Prompt Vault**, a curated collection of ready-to-use AI prompts spanning realistic visuals and educational storytelling styles."
      ),
      p(
        "We're a small, hands-on team building at the intersection of AI tools and content creation, and we're constantly refining our material based on what actually works on today's platforms."
      ),
      p(
        "Development Rabbit started as a side experiment — testing whether AI video tools could replace an entire production crew for a single creator. After months of trial, error, and a growing folder of prompts that actually worked, we packaged everything we learned into a single course so other creators wouldn't have to start from zero."
      ),
      p("📩 Reach us anytime at **support@developmentrabbit.com**"),
    ],
  },

  contact: {
    title: "Contact Us",
    lastUpdated: null,
    blocks: [
      p(
        "We'd love to hear from you — whether it's a question before you buy, help with an existing purchase, or a partnership inquiry."
      ),
      ul([
        "Email: support@developmentrabbit.com",
        "Phone / WhatsApp: +91 7903576683",
        "Business Address: Muslim Bazar, Giridih, Jharkhand, India",
        "Support Hours: Mon–Sat, 10 AM – 6 PM IST",
        "Instagram: @developmentrabbit",
      ]),
      p("For order-related queries, please include your order ID/payment reference so we can assist you faster."),
      p("Response time: we typically reply within 24–48 hours."),
    ],
  },
};

const stripBold = (text) => text.replace(/\*\*/g, "");

export const legalPageToPlainText = (page) => {
  const lines = [page.title, page.lastUpdated ? `Last updated: ${page.lastUpdated}` : null, ""];
  page.blocks.forEach((block) => {
    if (block.type === "h3") {
      lines.push(stripBold(block.text), "");
    } else if (block.type === "p") {
      lines.push(stripBold(block.text), "");
    } else if (block.type === "ul") {
      block.items.forEach((item) => lines.push(`- ${stripBold(item)}`));
      lines.push("");
    }
  });
  return lines.filter((line) => line !== null).join("\n");
};
