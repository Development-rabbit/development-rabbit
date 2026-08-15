import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { resolvePostLoginDestination } from "../utils/postLoginRedirect";

const GithubCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGithub } = useAuth();
  const [error, setError] = useState("");
  // GitHub's authorization code is single-use; guard against StrictMode's
  // double-invoked effect (and any accidental re-render) trying to redeem it twice.
  const attempted = useRef(false);

  useEffect(() => {
    if (attempted.current) return;
    attempted.current = true;

    const code = searchParams.get("code");
    const oauthError = searchParams.get("error");
    const state = searchParams.get("state");
    // Only an actual `state` param counts as an explicit deep-link target —
    // don't let this default to "/" and get mistaken for one.
    const explicitFrom = state ? decodeURIComponent(state) : null;

    if (oauthError) {
      setError("GitHub sign-in was cancelled.");
      return;
    }
    if (!code) {
      setError("Missing authorization code from GitHub.");
      return;
    }

    loginWithGithub(code)
      .then(async () => navigate(await resolvePostLoginDestination(explicitFrom), { replace: true }))
      .catch((err) => setError(err?.response?.data?.message || "GitHub sign-in failed."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center font-body">
      {error ? (
        <>
          <p className="text-red-600 mb-4">{error}</p>
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to log in
          </Link>
        </>
      ) : (
        <p className="text-brand-muted">Signing you in with GitHub…</p>
      )}
    </div>
  );
};

export default GithubCallback;
