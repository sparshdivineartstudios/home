import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TestimonialSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";
import { useState } from "react";

const Index = () => {
  const [pageLoading, setPageLoading] = useState(true);

  return (
    <div className="min-h-screen">
      {pageLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/90 text-foreground">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-lg font-medium">Loading content…</p>
            <p className="text-sm text-muted-foreground">Finishing up images and data from server</p>
          </div>
        </div>
      )}

      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts onLoaded={() => setPageLoading(false)} />
      <TestimonialSection />
      {/* CTA */}
      <section className="section-padding bg-foreground text-center">
        <div className="container-custom max-w-2xl">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
            Custom Orders Welcome
          </h2>
          <p className="text-primary-foreground/70 mb-8 font-body">
            Have something specific in mind? We create bespoke resin, candle & concrete decor pieces tailored to your vision.
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wide uppercase rounded-md hover:bg-gold-dark transition-colors"
          >
            Request Custom Order
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Index;
