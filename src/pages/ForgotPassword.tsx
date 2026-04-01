import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Mail } from "lucide-react";
import concreteImg from "@/assets/concrete-category.jpg";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    toast({ title: "Reset Link Sent!", description: "Check your email for the password reset link." });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img src={concreteImg} alt="Sparsh Concrete" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40 flex items-end p-12">
          <div>
            <h2 className="font-heading text-3xl font-bold text-primary-foreground mb-2">Reset Password</h2>
            <p className="text-primary-foreground/80 text-sm">We'll help you get back into your account.</p>
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Link to="/login" className="text-sm text-primary hover:text-gold-dark transition-colors inline-flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Login
            </Link>
            <h1 className="font-heading text-3xl font-bold text-foreground mt-6 mb-2">Forgot Password?</h1>
            <p className="text-muted-foreground text-sm">Enter your email and we'll send you a reset link</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email Address</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-card" />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-gold-dark font-body tracking-wide uppercase text-sm">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail size={28} className="text-primary" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">Check Your Email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <strong className="text-foreground">{email}</strong>. Please check your inbox.
              </p>
              <Button variant="outline" onClick={() => setSent(false)} className="mt-4">
                Try Different Email
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
