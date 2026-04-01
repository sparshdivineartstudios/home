import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import loginImg from "@/assets/resin-category.jpg";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const ok = await login(email, password);
    setLoading(false);
    if (ok) {
      toast({ title: "Welcome back!", description: "You've logged in successfully." });
      navigate("/");
    } else {
      toast({ title: "Login Failed", description: "Invalid email or password. Try admin@sparsh.com / admin123", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={loginImg} alt="Sparsh Art" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40 flex items-end p-12">
          <div>
            <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-2">Welcome Back</h2>
            <p className="text-primary-foreground/80 text-sm">Sign in to access your favorites and order history.</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link to="/" className="text-sm text-primary hover:text-gold-dark transition-colors">← Back to Home</Link>
            <h1 className="font-heading text-3xl font-bold text-foreground mt-6 mb-2">Sign In</h1>
            <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-card" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-card pr-10" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input type="checkbox" className="rounded border-border" /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:text-gold-dark transition-colors">Forgot Password?</Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground hover:bg-gold-dark font-body tracking-wide uppercase text-sm">
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account? <Link to="/signup" className="text-primary hover:text-gold-dark font-medium transition-colors">Create one</Link>
          </p>

          <div className="bg-muted rounded-lg p-4 text-xs text-muted-foreground">
            <p className="font-medium mb-1">Demo Credentials:</p>
            <p>Admin: admin@sparsh.com / admin123</p>
            <p>User: user@sparsh.com / user123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
