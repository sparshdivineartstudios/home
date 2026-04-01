import { Link } from "react-router-dom";
import resinImg from "@/assets/resin-category.jpg";
import candlesImg from "@/assets/candles-category.jpg";
import concreteImg from "@/assets/concrete-category.jpg";

const categories = [
  {
    title: "Art Decor",
    description: "Unique art pieces, patterns & swirls — each one a one-of-a-kind masterpiece.",
    image: resinImg,
  },
  {
    title: "Candles",
    description: "Hand-poured aromatic candles in unique vessels, designed to set the perfect mood.",
    image: candlesImg,
  },
  {
    title: "Concrete Decor",
    description: "Minimalist planters, trays & bookends with gold leaf accents for modern spaces.",
    image: concreteImg,
  },
];

const CategorySection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3 font-body">Our Craft</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Three Materials, Infinite Possibilities
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((cat, i) => (
            <Link
              to="/products"
              key={cat.title}
              className="group hover-lift rounded-lg overflow-hidden bg-card"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  width={800}
                  height={1024}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-heading text-xl sm:text-2xl font-semibold text-foreground mb-2">{cat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
