import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <img
        src={heroBanner}
        alt="Sparsh Divine Art Studio - Luxury handcrafted decor"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-3xl mx-auto slide-up">
        <p className="text-sm sm:text-base tracking-[0.3em] uppercase text-gold-light mb-4 font-body">
          Handcrafted with Love
        </p>
        <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
          Art That <span className="text-gradient-gold">Touches</span> Your Soul
        </h2>
        <p className="text-base sm:text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8 font-body">
          Discover unique resin art, aromatic wax candles, and elegant concrete decor — crafted to transform any space into a sanctuary.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-primary hover:bg-gold-dark text-primary-foreground font-body tracking-wide uppercase text-sm px-8">
            <Link to="/products">Explore Collection</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-primary-foreground/40 text-primary-foreground bg-primary-foreground/10 hover:bg-primary-foreground/20 font-body tracking-wide uppercase text-sm px-8">
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
