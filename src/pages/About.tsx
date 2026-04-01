import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import studioImg from "@/assets/about-studio.jpg";
import { Heart, Palette, Leaf } from "lucide-react";

const values = [
  { icon: Heart, title: "Made with Love", desc: "Every piece carries the warmth and passion of our artisans." },
  { icon: Palette, title: "Unique by Design", desc: "No two pieces are the same — each creation is one-of-a-kind." },
  { icon: Leaf, title: "Eco-Conscious", desc: "We use sustainable materials and eco-friendly practices." },
];

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        {/* Hero */}
        <div className="section-padding bg-cream-dark text-center">
          <div className="container-custom">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3 font-body">Our Story</p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Sparsh Divine Art Studio
            </h1>
            <p className="max-w-2xl mx-auto text-muted-foreground leading-relaxed">
              Born from a deep love for art and craftsmanship, Sparsh Divine Art Studio creates handmade decor pieces that bring beauty, warmth and character to every corner of your home.
            </p>
          </div>
        </div>

        {/* Story + Image */}
        <div className="section-padding">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <img src={studioImg} alt="Our studio" loading="lazy" width={1280} height={720} className="rounded-lg w-full object-cover" />
            </div>
            <div className="space-y-5">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">The Sparsh Journey</h2>
              <p className="text-muted-foreground leading-relaxed">
                What started as a small creative passion has blossomed into a studio that celebrates the art of handmade decor. We specialize in three mediums — resin, wax, and concrete — each offering limitless possibilities to create stunning, functional art pieces.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                From unique art pieces to soothing candles and minimalist concrete planters, every product is meticulously crafted to elevate your space. We believe that decor should tell a story, and every Home creation has one.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We also love working on custom orders — whether it's a special gift, wedding favours, or corporate gifting, we bring your vision to life with our artistry.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="section-padding bg-cream-dark">
          <div className="container-custom">
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((v, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <v.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default About;
