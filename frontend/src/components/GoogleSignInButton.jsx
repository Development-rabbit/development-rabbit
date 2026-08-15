import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loadGoogleIdentityScript } from "../utils/loadGoogleIdentity";
import { resolvePostLoginDestination } from "../utils/postLoginRedirect";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Renders Google's own button widget instead of a custom one. A custom
// button wired to google.accounts.id.prompt() (One Tap) looked more
// consistent with GithubSignInButton, but One Tap silently stops
// reappearing after a user dismisses it once (Google suppresses that
// "moment" for a cooldown) — clicking would just do nothing. renderButton
// always opens a real Google sign-in popup on click, which doesn't have
// that suppression problem.
const GoogleSignInButton = ({ onError }) => {
  const buttonRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    const init = async () => {
      const loaded = await loadGoogleIdentityScript();
      if (!loaded || cancelled || !buttonRef.current) {
        if (!loaded) onError?.("Could not load Google sign-in. Please try again.");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          try {
            await loginWithGoogle(response.credential);
            const destination = await resolvePostLoginDestination(location.state?.from?.pathname);
            navigate(destination, { replace: true });
          } catch (err) {
            onError?.(err?.response?.data?.message || "Google sign-in failed.");
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        shape: "pill",
        width: 320,
        text: "continue_with",
      });
    };

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!GOOGLE_CLIENT_ID) return null;

  return <div ref={buttonRef} className="flex justify-center" />;
};

export default GoogleSignInButton;
