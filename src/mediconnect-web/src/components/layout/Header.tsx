import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-outline-variant">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">
              local_hospital
            </span>
            <span className="text-xl font-bold text-primary">MediConnect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {isAuthenticated && (
              <>
                <Link
                  to="/booking"
                  className="text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Dat lich kham
                </Link>
                <Link
                  to="/appointments"
                  className="text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Lich hen cua toi
                </Link>
                <Link
                  to="/schedules"
                  className="text-on-surface-variant hover:text-primary transition-colors font-medium"
                >
                  Lich truc
                </Link>
              </>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-container rounded-full">
                  <span className="material-symbols-outlined text-on-primary-container text-sm">
                    person
                  </span>
                  <span className="text-sm font-medium text-on-primary-container">
                    {user?.fullName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-error transition-colors"
                >
                  Dang xuat
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Dang nhap
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 text-sm font-medium bg-primary text-on-primary rounded-full hover:bg-primary/90 transition-colors"
                >
                  Dang ky
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className="material-symbols-outlined">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-outline-variant mt-2 pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/booking"
                  className="px-3 py-2 text-on-surface-variant hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Dat lich kham
                </Link>
                <Link
                  to="/appointments"
                  className="px-3 py-2 text-on-surface-variant hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Lich hen cua toi
                </Link>
                <Link
                  to="/schedules"
                  className="px-3 py-2 text-on-surface-variant hover:text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Lich truc
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 text-left text-error"
                >
                  Dang xuat
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Dang nhap
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 text-primary"
                  onClick={() => setMenuOpen(false)}
                >
                  Dang ky
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
