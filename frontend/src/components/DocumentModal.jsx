import { useEffect } from "react";
import { legalPageToPlainText } from "../data/legalPages";

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M5 5l10 10M15 5 5 15" strokeLinecap="round" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M10 3v9m0 0 3.5-3.5M10 12l-3.5-3.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 14v1.5A1.5 1.5 0 0 0 5.5 17h9a1.5 1.5 0 0 0 1.5-1.5V14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Renders `**bold**` spans within a block of text; everything else is plain.
const renderInline = (text) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) =>
    chunk.startsWith("**") && chunk.endsWith("**") ? (
      <strong key={i} className="font-semibold text-ink">
        {chunk.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{chunk}</span>
    )
  );

const DocumentModal = ({ page, onClose }) => {
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  if (!page) return null;

  const handleDownload = () => {
    const text = legalPageToPlainText(page);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${page.title.toLowerCase().replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="document-modal-title"
    >
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-ink/10 shrink-0">
          <div>
            <h2 id="document-modal-title" className="font-heading font-bold text-xl text-ink">
              {page.title}
            </h2>
            {page.lastUpdated && (
              <p className="font-body text-xs text-brand-muted mt-1">Last updated: {page.lastUpdated}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary hover:opacity-90 transition-opacity px-3.5 py-2 rounded-full"
            >
              <DownloadIcon />
              Download
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="w-8 h-8 rounded-full border border-ink/10 text-ink/60 hover:text-ink hover:bg-mist flex items-center justify-center transition-colors"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {page.blocks.map((block, i) => {
            if (block.type === "h3") {
              return (
                <h3
                  key={i}
                  className="font-heading font-bold text-ink mb-2 first:mt-0 mt-6"
                >
                  {block.text}
                </h3>
              );
            }
            if (block.type === "ul") {
              return (
                <ul key={i} className="list-disc marker:text-primary pl-5 flex flex-col gap-2 mb-4">
                  {block.items.map((item, j) => (
                    <li key={j} className="font-body text-sm text-brand-muted leading-relaxed">
                      {renderInline(item)}
                    </li>
                  ))}
                </ul>
              );
            }
            return (
              <p key={i} className="font-body text-sm text-brand-muted leading-relaxed mb-4">
                {renderInline(block.text)}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
