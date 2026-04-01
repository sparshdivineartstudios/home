import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Product } from "@/data/products";
import { productsService } from "@/services/productsService";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productsService.getAllProducts();
        setProducts(allProducts.slice(0, 4));
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-cream-dark">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Featured Creations
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200"></div>
                <div className="p-3 sm:p-4">
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-cream-dark">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3 font-body">Bestsellers</p>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
            Featured Creations
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`} className="group hover-lift bg-card rounded-lg overflow-hidden shadow-sm">
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4">
                <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-primary mb-1">{product.category}</p>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground leading-snug mb-1">{product.name}</h3>
                <p className="text-sm font-semibold text-gold-dark">{product.price}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-block font-body text-sm tracking-wide uppercase border-b-2 border-primary text-primary pb-1 hover:text-gold-dark hover:border-gold-dark transition-colors"
          >
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
