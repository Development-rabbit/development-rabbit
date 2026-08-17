import { useDevMode } from "../hooks/useDevMode";

// Only ever renders on localhost — see src/utils/devMode.js.
const DevModeToggle = () => {
  const { devModeEnabled, canUseDevMode, setDevMode } = useDevMode();

  if (!canUseDevMode) return null;

  return (
    <button
      onClick={() => setDevMode(!devModeEnabled)}
      title={
        devModeEnabled
          ? "Dev mode ON — protected/admin pages are unlocked. Click to turn off."
          : "Dev mode OFF. Click to unlock protected/admin pages without logging in (localhost only)."
      }
      className={`fixed bottom-4 right-4 z-50 font-body text-xs font-bold px-3 py-2 rounded-full shadow-lg border transition-colors ${
        devModeEnabled
          ? "bg-red-600 text-white border-red-700 hover:bg-red-700"
          : "bg-white text-ink/60 border-black/10 hover:bg-mist"
      }`}
    >
      {devModeEnabled ? "🛠 Dev Mode: ON" : "🛠 Dev Mode: OFF"}
    </button>
  );
};

export default DevModeToggle;
