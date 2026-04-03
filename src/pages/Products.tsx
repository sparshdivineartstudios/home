import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SkeletonLoader } from "@/components/LoadingSpinner";
import { Product, categories, materials, colors, sortOptions } from "@/data/products";
import { productsService } from "@/services/productsService";
import { useAuth } from "@/contexts/AuthContext";
import { Heart, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Products = () => {
  const { favorites, toggleFavorite } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [material, setMaterial] = useState("All");
  const [color, setColor] = useState("All");
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFavOnly, setShowFavOnly] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await productsService.getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (category !== "All") result = result.filter((p) => p.category === category);
    if (material !== "All") result = result.filter((p) => p.material === material);
    if (color !== "All") result = result.filter((p) => p.color === color);
    result = result.filter((p) => p.priceNum >= priceRange[0] && p.priceNum <= priceRange[1]);
    if (showFavOnly) result = result.filter((p) => favorites.includes(p._id));

    // Sort
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.priceNum - b.priceNum); break;
      case "price-desc": result.sort((a, b) => b.priceNum - a.priceNum); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [products, category, material, color, sort, priceRange, showFavOnly, favorites]);

  const hasActiveFilters = category !== "All" || material !== "All" || color !== "All" || priceRange[0] > 0 || priceRange[1] < 5000 || showFavOnly;

  const clearFilters = () => {
    setCategory("All");
    setMaterial("All");
    setColor("All");
    setPriceRange([0, 5000]);
    setShowFavOnly(false);
    setSort("newest");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        {/* Header */}
        <div className="section-padding pb-8 sm:pb-12 text-center bg-cream-dark">
          <div className="container-custom">
            <p className="text-sm tracking-[0.3em] uppercase text-primary mb-3 font-body">Our Collection</p>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              Handcrafted Decor
            </h1>
          </div>
        </div>

        <div className="section-padding pt-6 sm:pt-8">
          <div className="container-custom">
            {/* Top bar: categories + controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              {/* Category pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map((f) => (
                  <button
                    key={f}
                    onClick={() => setCategory(f)}
                    className={`px-4 py-1.5 rounded-full text-sm font-body tracking-wide transition-colors ${
                      category === f
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground hover:bg-primary/10"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowFavOnly(!showFavOnly)}
                  className={`p-2 rounded-full transition-colors ${showFavOnly ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                  title="Show favorites only"
                >
                  <Heart size={18} className={showFavOnly ? "fill-primary" : ""} />
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-full transition-colors ${showFilters ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <SlidersHorizontal size={18} />
                </button>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm bg-card border border-border rounded-md px-3 py-1.5 text-foreground font-body"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="bg-card rounded-lg p-4 sm:p-6 mb-6 border border-border fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-lg font-semibold text-foreground">Filters</h3>
                  {hasActiveFilters && (
                    <button onClick={clearFilters} className="text-sm text-primary hover:text-gold-dark flex items-center gap-1">
                      <X size={14} /> Clear All
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Material</label>
                    <select value={material} onChange={(e) => setMaterial(e.target.value)} className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground">
                      {materials.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Color</label>
                    <select value={color} onChange={(e) => setColor(e.target.value)} className="w-full text-sm bg-background border border-border rounded-md px-3 py-2 text-foreground">
                      {colors.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">
                      Price Range: ₹{priceRange[0]} – ₹{priceRange[1]}
                    </label>
                    <div className="flex gap-2">
                      <input type="range" min={0} max={5000} step={100} value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="flex-1 accent-[hsl(36,60%,48%)]"
                      />
                      <input type="range" min={0} max={5000} step={100} value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="flex-1 accent-[hsl(36,60%,48%)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-4">{filtered.length} product{filtered.length !== 1 ? "s" : ""} found</p>

            {/* Grid */}
            {loading ? (
              <SkeletonLoader count={8} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.filter(p => p._id && p.images && p.images.length > 0).map((product) => (
                <div key={product._id} className="group hover-lift bg-card rounded-lg overflow-hidden shadow-sm relative">
                  {/* Fav button */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggleFavorite(product._id); }}
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                  >
                    <Heart size={14} className={favorites.includes(product._id) ? "fill-primary text-primary" : "text-muted-foreground"} />
                  </button>

                  <Link to={`/product/${product._id}`}>
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
                </div>
              ))}
            </div>
            )}

            {filtered.length === 0 && !loading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">No products match your filters.</p>
                <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
