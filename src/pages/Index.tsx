import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import TestimonialSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />
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
