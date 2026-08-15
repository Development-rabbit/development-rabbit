import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoHorizontal from "../assets/Logo-horizontal.png";


const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 rounded-full transition-colors ${
    isActive ? "bg-lavender text-primary font-semibold" : "text-ink/70 hover:text-ink"
  }`;

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 px-4 sm:px-6 pt-4 pb-3">
      <div className="max-w-6xl mx-auto bg-white rounded-full shadow-sm border border-black/5 px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center shrink-0">
          <img src={LogoHorizontal} alt="Development Rabbit" className="h-7 sm:h-12 w-auto" />
        </Link>

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
          {isAuthenticated && (
            <NavLink to="/my-courses" className={navLinkClass}>
              My Courses
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/courses" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:inline text-sm text-ink/70">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-ink/80 hover:text-ink px-3 py-1.5 rounded-full border border-black/10 hover:bg-mist"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-ink/80 hover:text-ink">
                Log In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold text-white bg-gradient-to-r from-primary to-royal-purple hover:opacity-90 px-4 py-2 rounded-full transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
