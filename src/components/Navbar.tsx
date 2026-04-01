import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Heart, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.jpeg";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user, isGuest, logout, favorites } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-white/90 backdrop-blur-md border-b border-border">
      <div className="container-custom flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Home Decor" className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover" />
          <div className="hidden sm:block">
            <h1 className="font-heading text-lg font-semibold text-foreground leading-tight">HOME</h1>
            <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">Handcrafted Decor</p>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                location.pathname === link.path ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className={`text-sm font-medium tracking-wide uppercase transition-colors hover:text-primary ${
                location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/products" className="relative p-2 text-muted-foreground hover:text-primary transition-colors" title="Favorites">
            <Heart size={20} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>
          {isGuest ? (
            <Link to="/login" className="px-4 py-1.5 bg-primary text-primary-foreground text-sm font-body tracking-wide rounded-md hover:bg-gold-dark transition-colors">
              Login
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground font-medium">{user?.name}</span>
              {user?.role === "admin" && (
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">Admin</span>
              )}
              <button onClick={logout} className="p-2 text-muted-foreground hover:text-destructive transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Link to="/products" className="relative p-2 text-muted-foreground">
            <Heart size={20} />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>
          <button onClick={() => setOpen(!open)} className="p-2 text-foreground" aria-label="Toggle menu">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-warm-white border-b border-border fade-in">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={`block text-sm font-medium tracking-wide uppercase py-2 transition-colors hover:text-primary ${
                  location.pathname === link.path ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className={`block text-sm font-medium tracking-wide uppercase py-2 transition-colors hover:text-primary ${
                  location.pathname === "/admin" ? "text-primary" : "text-muted-foreground"
                }`}
              >
                Admin
              </Link>
            )}
            <div className="pt-3 border-t border-border">
              {isGuest ? (
                <Link to="/login" onClick={() => setOpen(false)} className="block text-sm font-medium text-primary py-2">
                  Login / Sign Up
                </Link>
              ) : (
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-foreground">{user?.name} {user?.role === "admin" && "(Admin)"}</span>
                  <button onClick={() => { logout(); setOpen(false); }} className="text-sm text-destructive">Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
