import { useEffect, useState } from "react";
import { DEV_MODE_CHANGE_EVENT, isDevModeEnabled, isLocalhost, setDevMode } from "../utils/devMode";

// Re-renders subscribers when dev mode is toggled anywhere on the page
// (localStorage alone doesn't emit an event within the same tab).
export const useDevMode = () => {
  const [enabled, setEnabled] = useState(isDevModeEnabled);

  useEffect(() => {
    const handleChange = () => setEnabled(isDevModeEnabled());
    window.addEventListener(DEV_MODE_CHANGE_EVENT, handleChange);
    return () => window.removeEventListener(DEV_MODE_CHANGE_EVENT, handleChange);
  }, []);

  return { devModeEnabled: enabled, canUseDevMode: isLocalhost(), setDevMode };
};
