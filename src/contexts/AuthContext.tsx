import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  favorites: string[]; // Changed to string[] for MongoDB ObjectIds
  toggleFavorite: (productId: string) => void;
  guestStartTime: number;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};

const API_BASE = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("sparsh_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const [guestStartTime] = useState<number>(() => {
    const saved = localStorage.getItem("sparsh_guest_start");
    if (saved) return parseInt(saved);
    const now = Date.now();
    localStorage.setItem("sparsh_guest_start", now.toString());
    return now;
  });

  const isGuest = !user;

  // Load favorites when user changes
  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("sparsh_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("sparsh_user");
    }
  }, [user]);

  const loadFavorites = async () => {
    if (!user) return;
    try {
      const token = localStorage.getItem("sparsh_token");
      if (!token) return;

      const response = await fetch(`${API_BASE}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const favProducts = await response.json();
        setFavorites(favProducts.map((p: any) => p._id));
      } else {
        console.warn('Failed to load favorites:', response.status);
        // Don't crash, just continue with empty favorites
      }
    } catch (error) {
      console.warn('Error loading favorites:', error);
      // Don't crash, just continue with empty favorites
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("sparsh_token", data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        localStorage.setItem("sparsh_token", data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setFavorites([]);
    localStorage.removeItem("sparsh_token");
    localStorage.removeItem("sparsh_guest_start");
    localStorage.setItem("sparsh_guest_start", Date.now().toString());
  };

  const toggleFavorite = async (productId: string) => {
    if (!user) return;

    const token = localStorage.getItem("sparsh_token");
    const isFavorited = favorites.includes(productId);

    try {
      if (isFavorited) {
        // Remove from favorites
        await fetch(`${API_BASE}/favorites/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(prev => prev.filter(id => id !== productId));
      } else {
        // Add to favorites
        await fetch(`${API_BASE}/favorites/${productId}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(prev => [...prev, productId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, login, signup, logout, favorites, toggleFavorite, guestStartTime, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
