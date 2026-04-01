import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Home" className="h-12 w-12 rounded-full object-cover" />
              <div>
                <h3 className="font-heading text-lg font-semibold">HOME</h3>
                <p className="text-xs tracking-[0.2em] text-gold-light uppercase">Handcrafted Decor</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Handcrafted decor pieces made with love — art, candles & concrete creations for every space.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Home", "Products", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm text-primary-foreground/70 hover:text-gold-light transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Categories</h4>
            <ul className="space-y-2">
              {["Resin Art", "Wax Candles", "Concrete Decor", "Custom Orders"].map((item) => (
                <li key={item}>
                  <Link
                    to="/products"
                    className="text-sm text-primary-foreground/70 hover:text-gold-light transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-base font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Mail size={16} className="text-gold-light" />
                sparsh@example.com
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <Phone size={16} className="text-gold-light" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm text-primary-foreground/70">
                <MapPin size={16} className="text-gold-light" />
                India
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/30 transition-colors">
                <Instagram size={18} className="text-gold-light" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-gold/30 transition-colors">
                <Facebook size={18} className="text-gold-light" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-primary-foreground/10 text-center">
          <p className="text-xs text-primary-foreground/50">
            © {new Date().getFullYear()} Sparsh Divine Art Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
