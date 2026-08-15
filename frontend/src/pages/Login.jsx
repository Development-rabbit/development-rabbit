import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleSignInButton from "../components/GoogleSignInButton";
import GithubSignInButton from "../components/GithubSignInButton";
import { resolvePostLoginDestination } from "../utils/postLoginRedirect";
import LogoHorizontal from "../assets/Logo-horizontal.png";

const HAS_SOCIAL_AUTH = Boolean(
  import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GITHUB_CLIENT_ID
);

const dotGridStyle = {
  backgroundImage: "radial-gradient(circle, #ffffff26 1px, transparent 1px)",
  backgroundSize: "18px 18px",
};

const primaryGlowStyle = {
  background: "radial-gradient(circle, #7B3FF2 0%, rgba(123,63,242,0) 70%)",
};

const royalGlowStyle = {
  background: "radial-gradient(circle, #4521A8 0%, rgba(69,33,168,0) 70%)",
};

const SparkleIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M11.5 3.5 13.2 8.8l5.3 1.7-5.3 1.7-1.7 5.3-1.7-5.3-5.3-1.7 5.3-1.7Z" strokeLinejoin="round" />
    <path d="M18.5 15.5 19.2 17.5 21.2 18.2 19.2 18.9 18.5 20.9 17.8 18.9 15.8 18.2 17.8 17.5Z" strokeLinejoin="round" />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-4 h-4" }) => (
  <svg viewBox="0 0 20 20" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M16 10H4M9 5l-5 5 5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const isLogin = location.pathname === "/login";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        await login({ email: form.email, password: form.password });
      } else {
        await register({ name: form.name, email: form.email, password: form.password });
        // Backend registration doesn't issue a session — log the new account in immediately
        await login({ email: form.email, password: form.password });
      }
      const destination = await resolvePostLoginDestination(location.state?.from?.pathname);
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row-reverse min-h-screen w-full bg-white">
      {/* --- Left Side: Form Container --- */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-16 lg:px-20 py-12 relative">
        <div className="absolute top-6 left-8 sm:left-16 lg:left-20 right-8 sm:right-16 lg:right-20 flex items-center justify-between">
          <Link to="/">
            <img src={LogoHorizontal} alt="Development Rabbit" className="h-7 w-auto" />
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-brand-muted hover:text-ink transition-colors"
          >
            <ArrowLeftIcon />
            Back to Home
          </Link>
        </div>

        {/* Toggle Tabs */}
        <div className="flex gap-8 mb-10 border-b border-ink/10 pb-4">
          <Link
            to="/login"
            className={`font-heading text-lg font-bold relative transition-colors duration-300 ${
              isLogin ? "text-ink" : "text-brand-muted hover:text-ink"
            }`}
          >
            Log In
            {isLogin && (
              <span className="absolute -bottom-[18px] left-0 w-full h-[3px] bg-primary rounded-full"></span>
            )}
          </Link>

          <Link
            to="/signup"
            className={`font-heading text-lg font-bold relative transition-colors duration-300 ${
              !isLogin ? "text-ink" : "text-brand-muted hover:text-ink"
            }`}
          >
            Sign Up
            {!isLogin && (
              <span className="absolute -bottom-[18px] left-0 w-full h-[3px] bg-primary rounded-full"></span>
            )}
          </Link>
        </div>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 font-body text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="flex flex-col mb-5">
              <label className="font-body text-sm font-semibold text-ink mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className="px-4 py-3 border border-ink/10 rounded-xl outline-none transition-all font-body focus:border-primary focus:ring-4 focus:ring-primary/10"
                value={form.name}
                onChange={handleChange("name")}
                required
              />
            </div>
          )}

          <div className="flex flex-col mb-5">
            <label className="font-body text-sm font-semibold text-ink mb-2" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="name@example.com"
              className="px-4 py-3 border border-ink/10 rounded-xl outline-none transition-all font-body focus:border-primary focus:ring-4 focus:ring-primary/10"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="flex flex-col mb-8">
            <label className="font-body text-sm font-semibold text-ink mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              className="px-4 py-3 border border-ink/10 rounded-xl outline-none transition-all font-body focus:border-primary focus:ring-4 focus:ring-primary/10"
              value={form.password}
              onChange={handleChange("password")}
              minLength={isLogin ? undefined : 6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-primary to-royal-purple text-white rounded-full font-body font-semibold text-lg hover:opacity-90 transition-opacity duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Please wait…" : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        {HAS_SOCIAL_AUTH && (
          <div className="mt-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-ink/10" />
              <span className="font-body text-xs font-semibold text-brand-muted uppercase tracking-wide">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-ink/10" />
            </div>
            <div className="space-y-3">
              <GoogleSignInButton onError={setError} />
            </div>
          </div>
        )}
      </div>

      {/* --- Right Side: Brand Panel --- */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden bg-gradient-to-br from-deep-purple via-ink to-ink items-center justify-center px-16">
        <div
          className="absolute -top-32 -right-16 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-40 pointer-events-none"
          style={primaryGlowStyle}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={royalGlowStyle}
          aria-hidden="true"
        />
        <div className="hidden xl:block absolute inset-0 opacity-40" style={dotGridStyle} aria-hidden="true" />

        <div className="relative max-w-md text-center">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary bg-white/10 px-4 py-1.5 rounded-full mb-6">
            <SparkleIcon className="w-3.5 h-3.5" />
            The Future of Filmmaking
          </span>
          <h2 className="font-heading font-bold text-3xl sm:text-4xl leading-tight text-white mb-4">
            Turn Prompts Into <span className="text-primary">Cinematic Video</span>
          </h2>
          <p className="font-body text-white/60">
            Join a growing community of AI creators learning to prompt, direct, and edit with Runway, Sora, Pika,
            and Kling.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
