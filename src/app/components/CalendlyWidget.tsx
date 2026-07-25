import Script from "next/script";

export default function CalendlyWidget() {
  return (
    <>
      {/* Calendly inline widget begin */}
      <div
        className="calendly-inline-widget"
        data-url="https://calendly.com/8xworkk/30min"
        style={{ minWidth: "320px", height: "700px" }}
      />
      <Script
        src="https://assets.calendly.com/assets/external/widget.js"
        strategy="lazyOnload"
      />
      {/* Calendly inline widget end */}
    </>
  );
}
