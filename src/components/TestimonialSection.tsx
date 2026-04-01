import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    text: "The resin clock I ordered is absolutely stunning! It's the centrepiece of my living room now. Truly divine craftsmanship.",
    rating: 5,
  },
  {
    name: "Ankit Patel",
    text: "Gifted the concrete planters to my mom — she loved them! The gold detailing is so elegant. Will definitely order again.",
    rating: 5,
  },
  {
    name: "Meera Joshi",
    text: "The candles smell heavenly and look so pretty. Perfect for festive gifting. Highly recommend Sparsh!",
    rating: 5,
  },
];

const TestimonialSection = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3 font-body">Testimonials</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-card p-6 sm:p-8 rounded-lg" style={{ boxShadow: "var(--shadow-card)" }}>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} className="fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4 italic">"{t.text}"</p>
              <p className="font-heading text-sm font-semibold text-foreground">— {t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
