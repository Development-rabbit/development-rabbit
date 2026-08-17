import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useDevMode } from "../hooks/useDevMode";
import LogoHorizontal from "../assets/Logo-horizontal.png";

const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-full transition-colors ${
    isActive ? "bg-lavender text-primary font-semibold" : "text-ink/70 hover:text-ink"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `block px-4 py-3.5 rounded-xl text-lg font-heading font-semibold transition-colors ${
    isActive ? "bg-lavender text-primary" : "text-ink/80 hover:bg-mist hover:text-ink"
  }`;

const CartIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="18" cy="20" r="1.4" />
    <path d="M2.5 3h2l2.3 11.4a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HamburgerIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
  </svg>
);

const CloseIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
  </svg>
);

const LogoutIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count } = useCart();
  const { devModeEnabled } = useDevMode();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  // Belt-and-braces: also close on route change (back/forward nav, or any
  // programmatic navigation that doesn't go through a link's onClick).
  // Adjusting state during render, not in an effect, avoids an extra
  // committed render on every navigation.
  const [lastPathname, setLastPathname] = useState(location.pathname);
  if (location.pathname !== lastPathname) {
    setLastPathname(location.pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKeyDown);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 px-3 sm:px-6 pt-4 pb-3">
      <div className="max-w-6xl mx-auto bg-white rounded-full shadow-sm border border-black/5 px-3 sm:px-6 h-16 flex items-center justify-between gap-1.5 sm:gap-4">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-mist transition-colors shrink-0"
          >
            <HamburgerIcon />
          </button>
          <Link to="/" className="flex items-center shrink-0">
            <img src={LogoHorizontal} alt="Development Rabbit" className="h-8 -translate-y-[2px] sm:h-12 w-auto" />
          </Link>
        </div>

        <nav className="hidden sm:flex items-center gap-1 text-sm font-medium">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/courses" className={navLinkClass}>
            Courses
          </NavLink>
          {(isAuthenticated || devModeEnabled) && (
            <NavLink to="/my-courses" className={navLinkClass}>
              My Courses
            </NavLink>
          )}
          {(isAdmin || devModeEnabled) && (
            <NavLink to="/admin/courses" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        

        <div className="flex items-center min-w-0">
          <Link
            to="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-mist transition-colors shrink-0"
          >
            <CartIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            {count > 0 && (
              <span className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <span className="max-w-16 sm:max-w-none min-w-0 truncate text-sm text-ink/70">{user?.name}</span>
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="sm:hidden w-8 h-8 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-mist transition-colors shrink-0"
              >
                <LogoutIcon className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={handleLogout}
                className="hidden sm:inline-block text-sm font-semibold text-ink/80 hover:text-ink px-3 py-1.5 rounded-full border border-black/10 hover:bg-mist"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login" className="hidden sm:inline px-4 py-2 text-sm font-semibold text-ink/80 hover:text-ink">
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary to-royal-purple hover:opacity-90 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-opacity whitespace-nowrap shrink-0"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Full-screen mobile nav panel. The header row below (px-3 pt-4,
          then px-3 h-16 flex items-center, w-8 h-8 button) mirrors the
          collapsed bar's padding and hamburger size exactly, so the logo
          lands at the same coordinates whether the panel is open or closed. */}
      <div
        className={`sm:hidden fixed inset-0 z-70 bg-white flex flex-col transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        aria-hidden={!menuOpen}
      >
        <div className="px-3 pt-4">
          <div className="px-3 h-16 flex w-full justify-between flex-row-reverse items-center gap-1">
            <button
              type="button"
              onClick={closeMenu}
              aria-label="Close menu"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-mist transition-colors shrink-0"
            >
              <CloseIcon />
            </button>
            <Link to="/" className="flex items-center shrink-0" onClick={closeMenu}>
              <img src={LogoHorizontal} alt="Development Rabbit" className="h-10 w-auto" />
            </Link>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-6 py-6 overflow-y-auto">
          <NavLink to="/" end className={mobileNavLinkClass} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/about" className={mobileNavLinkClass} onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to="/courses" className={mobileNavLinkClass} onClick={closeMenu}>
            Courses
          </NavLink>
          {(isAuthenticated || devModeEnabled) && (
            <NavLink to="/my-courses" className={mobileNavLinkClass} onClick={closeMenu}>
              My Courses
            </NavLink>
          )}
          {(isAdmin || devModeEnabled) && (
            <NavLink to="/admin/courses" className={mobileNavLinkClass} onClick={closeMenu}>
              Admin
            </NavLink>
          )}

          <div className="h-px bg-ink/10 my-3" />

          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl">
              <span className="truncate text-lg font-heading font-semibold text-ink/80">{user?.name}</span>
              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                aria-label="Log out"
                className="w-10 h-10 rounded-full flex items-center justify-center text-ink/70 hover:text-ink hover:bg-mist transition-colors shrink-0"
              >
                <LogoutIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className={mobileNavLinkClass} onClick={closeMenu}>
                Log In
              </NavLink>
              <NavLink to="/signup" className={mobileNavLinkClass} onClick={closeMenu}>
                Sign Up
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
