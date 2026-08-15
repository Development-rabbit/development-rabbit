// Placeholder brand mark — a simple faceted shape in the brand purple,
// standing in for the real origami-rabbit logo until an actual SVG/PNG
// asset is dropped in (see "claude refrences/Logo.PNG" for the real mark).
// Swap this component's contents for an <img src="/logo.svg" ... /> once
// that asset is available; call sites (Navbar, Landing hero) won't need to change.
const RabbitMark = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <polygon points="16,2 24,12 16,17 8,12" fill="#7B3FF2" />
    <polygon points="16,17 24,12 24,22 16,30" fill="#4521A8" />
    <polygon points="16,17 8,12 8,22 16,30" fill="#9B6BFF" />
  </svg>
);

export default RabbitMark;
