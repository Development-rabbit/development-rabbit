import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loadGoogleIdentityScript } from "../utils/loadGoogleIdentity";
import { resolvePostLoginDestination } from "../utils/postLoginRedirect";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.52 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.47a5.55 5.55 0 0 1-2.4 3.64v3h3.87c2.27-2.09 3.58-5.17 3.58-8.83Z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.87-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.09A12 12 0 0 0 12 24Z"
    />
    <path fill="#FBBC05" d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.27a12 12 0 0 0 0 10.76l4-3.09Z" />
    <path
      fill="#EA4335"
      d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
    />
  </svg>
);

// Uses Google Identity Services' credential flow, but skips their rendered
// widget (renderButton) so we can keep the same pill styling as
// GithubSignInButton — google.accounts.id.prompt() triggered from a custom
// button is the documented way to do that.
const GoogleSignInButton = ({ onError }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const readyRef = useRef(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;
    let cancelled = false;

    loadGoogleIdentityScript().then((loaded) => {
      if (cancelled) return;
      if (!loaded) {
        onError?.("Could not load Google sign-in. Please try again.");
        setLoading(false);
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
      readyRef.current = true;
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    if (!readyRef.current) {
      onError?.("Google sign-in is still loading. Please try again in a moment.");
      return;
    }
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed?.() || notification.isSkippedMoment?.()) {
        onError?.("Google sign-in didn't open. Check your browser's pop-up/cookie settings and try again.");
      }
    });
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 py-3 border border-ink/10 rounded-full font-body font-semibold text-sm text-ink hover:bg-mist transition-colors disabled:opacity-60"
    >
      <GoogleIcon />
      Continue with Google
    </button>
  );
};

export default GoogleSignInButton;
