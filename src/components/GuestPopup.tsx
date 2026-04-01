import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, LogIn } from "lucide-react";

const POPUP_DELAY_MS = 30 * 60 * 1000; // 30 minutes

const GuestPopup = () => {
  const { isGuest, guestStartTime } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isGuest) return;

    const elapsed = Date.now() - guestStartTime;
    const remaining = Math.max(0, POPUP_DELAY_MS - elapsed);

    const timer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("sparsh_popup_dismissed");
      if (!dismissed) setShow(true);
    }, remaining);

    return () => clearTimeout(timer);
  }, [isGuest, guestStartTime]);

  const handleDismiss = () => {
    setShow(false);
    sessionStorage.setItem("sparsh_popup_dismissed", "true");
  };

  if (!isGuest) return null;

  return (
    <Dialog open={show} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Heart size={20} className="text-primary" /> Save Your Favorites!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create an account to save your favorite products, track orders, and get exclusive offers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4">
          <Button asChild className="bg-primary text-primary-foreground hover:bg-gold-dark">
            <Link to="/signup" onClick={handleDismiss}>
              <LogIn size={16} className="mr-2" /> Create Account
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login" onClick={handleDismiss}>
              Already have an account? Login
            </Link>
          </Button>
          <button onClick={handleDismiss} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Continue as Guest
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GuestPopup;
