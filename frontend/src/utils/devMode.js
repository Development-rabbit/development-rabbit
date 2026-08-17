// Lets you bypass ProtectedRoute/AdminRoute while working on the UI locally,
// without needing to log in every time. Gated on the *actual* hostname (not
// import.meta.env.DEV) so a production build can never end up with this on —
// the localStorage flag is simply ignored anywhere but localhost.
const DEV_MODE_KEY = "courseapp_dev_mode";
export const DEV_MODE_CHANGE_EVENT = "courseapp:devmode-change";

const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export const isLocalhost = () =>
  typeof window !== "undefined" && LOCAL_HOSTNAMES.has(window.location.hostname);

export const isDevModeEnabled = () =>
  isLocalhost() && localStorage.getItem(DEV_MODE_KEY) === "true";

export const setDevMode = (enabled) => {
  if (!isLocalhost()) return;
  if (enabled) localStorage.setItem(DEV_MODE_KEY, "true");
  else localStorage.removeItem(DEV_MODE_KEY);
  window.dispatchEvent(new Event(DEV_MODE_CHANGE_EVENT));
};
