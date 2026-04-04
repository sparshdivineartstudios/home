import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product } from "@/data/products";
import { productsService, type DrivePhoto } from "@/services/productsService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, ChevronLeft, ChevronRight, Share2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [driveImages, setDriveImages] = useState<DrivePhoto[]>([]);
  const { favorites, toggleFavorite, user, token } = useAuth();
  const { toast } = useToast();
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    if (!id || id === 'undefined') {
      setLoading(false);
      return;
    }

    const loadProduct = async () => {
      try {
        const prod = await productsService.getProduct(id);
        if (!prod || !prod._id) {
          console.error('Invalid product:', prod);
          setLoading(false);
          return;
        }
        if (cancelled) return;
        
        console.log('📦 Product loaded:', prod.name);
        console.log('📁 driveFolderId:', prod.driveFolderId);
        console.log('🔑 Token available:', !!token);
        
        setProduct(prod);

        // Prefer Drive photos when folder is linked (works for both guests and logged-in users)
        if (prod.driveFolderId) {
          console.log('🔄 Fetching Drive images for folder:', prod.driveFolderId);
          try {
            const photos = await productsService.getProductImages(id, token || undefined);
            if (cancelled) return;
            if (photos && photos.length > 0) {
              console.log('✅ Loaded Drive photos:', photos);
              console.log('First photo ID:', photos[0].id);
              setDriveImages(photos);
            } else {
              console.warn('⚠️ No photos returned from API');
            }
          } catch (err) {
            console.warn('❌ Could not fetch Drive images:', err);
            // silently ignore, will use product.images instead
          }
        } else {
          console.log('⏭️ No driveFolderId for this product');
        }

        // Load related products
        const allProducts = await productsService.getAllProducts();
        if (cancelled) return;
        const relatedProds = allProducts
          .filter((p) => p && p._id && p.category === prod.category && p._id !== prod._id)
          .slice(0, 3);
        setRelated(relatedProds);
      } catch (error) {
        if (cancelled) return;
        console.error('Error loading product:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center section-padding">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-64"></div>
            <div className="h-4 bg-gray-200 rounded mx-auto w-32"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center section-padding">
          <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link to="/products" className="text-primary hover:text-gold-dark transition-colors">← Back to Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isFav = favorites.includes(product._id);
  
  // Use Drive images if available, otherwise fallback to database images
  const photos = driveImages.length > 0 ? driveImages : [];
  const dbImages = (product.images || []).filter(Boolean);
  const hasPhotos = photos.length > 0;
  const allImages = hasPhotos ? photos : dbImages;

  const currentPhoto = hasPhotos ? photos[imgIndex] : null;

  // Get the full-size image URL (prefer imageUrl which is the full Drive export)
  const currentImageUrl = hasPhotos 
    ? (currentPhoto?.imageUrl || currentPhoto?.thumbnailUrl || currentPhoto?.webContentLink || '')
    : (dbImages[imgIndex] || '');

  const nextImg = () => {
    if (allImages.length > 0) setImgIndex((prev) => (prev + 1) % allImages.length);
  };
  const prevImg = () => {
    if (allImages.length > 0) setImgIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link Copied!", description: "Product link copied to clipboard." });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        {/* Breadcrumb */}
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>

        {/* Product */}
        <div className="section-padding pt-4 sm:pt-6">
          <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-card">
                {allImages.length > 0 && currentImageUrl ? (
                  // Display image via backend proxy (handles all formats: .mov preview, .heic conversion, etc.)
                  <>
                    <img
                      src={currentImageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.warn('Image failed to load:', currentImageUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    {allImages.length > 1 && (
                      <>
                        <button onClick={prevImg} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10">
                          <ChevronLeft size={20} className="text-foreground" />
                        </button>
                        <button onClick={nextImg} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors z-10">
                          <ChevronRight size={20} className="text-foreground" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span>Image unavailable</span>
                  </div>
                )}
              </div>
              
              {/* Navigation arrows for Drive images */}
              {hasPhotos && allImages.length > 1 && (
                <div className="flex gap-3 justify-center">
                  <button onClick={prevImg} className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                    <ChevronLeft size={20} className="text-foreground" />
                  </button>
                  <span className="flex items-center px-4 text-sm text-muted-foreground">
                    {imgIndex + 1} / {allImages.length}
                  </span>
                  <button onClick={nextImg} className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors">
                    <ChevronRight size={20} className="text-foreground" />
                  </button>
                </div>
              )}
              
              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {allImages.map((img, i) => {
                    const thumbUrl = typeof img === 'string' ? img : (img.thumbnailUrl || img.imageUrl);
                    return (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`w-20 h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-colors ${
                          i === imgIndex ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        {thumbUrl ? (
                          <img 
                            src={thumbUrl} 
                            alt={`Thumbnail ${i + 1}`}
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              console.warn(`Thumbnail ${i} failed to load:`, thumbUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground">
                            No img
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-6">
              <div>
                <p className="text-xs tracking-[0.2em] uppercase text-primary mb-2 font-body">{product.category}</p>
                <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
                <p className="text-2xl font-bold text-gold-dark font-body">{product.price}</p>
              </div>

              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Material</p>
                  <p className="text-sm font-medium text-foreground">{product.material}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Size</p>
                  <p className="text-sm font-medium text-foreground">{product.size}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Color</p>
                  <p className="text-sm font-medium text-foreground">{product.color}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Availability</p>
                  <p className={`text-sm font-medium ${product.inStock ? "text-green-600" : "text-destructive"}`}>
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="flex-1 bg-primary text-primary-foreground hover:bg-gold-dark font-body tracking-wide uppercase text-sm">
                  <ShoppingBag size={16} className="mr-2" /> Enquire Now
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavorite(product._id)}
                  className={isFav ? "border-primary text-primary" : ""}
                >
                  <Heart size={18} className={isFav ? "fill-primary" : ""} />
                </Button>
                <Button variant="outline" size="icon" onClick={handleShare}>
                  <Share2 size={18} />
                </Button>
              </div>

              {/* Admin edit hint */}
              {user?.role === "admin" && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <p className="text-sm font-medium text-primary mb-1">Admin Panel</p>
                  <p className="text-xs text-muted-foreground">
                    You can edit this product's details, images, and Drive folder link from the admin dashboard (coming soon). 
                    {product.driveFolder && <span> Drive Folder: {product.driveFolder}</span>}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="section-padding bg-cream-dark">
            <div className="container-custom">
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">You May Also Like</h2>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {related.filter(p => p._id).map((p) => (
                  <Link key={p._id} to={`/product/${p._id}`} className="group hover-lift bg-card rounded-lg overflow-hidden shadow-sm">
                    <div className="aspect-square overflow-hidden">
                      <img src={p.images[0]} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-[10px] sm:text-xs tracking-[0.15em] uppercase text-primary mb-1">{p.category}</p>
                      <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground leading-snug mb-1">{p.name}</h3>
                      <p className="text-sm font-semibold text-gold-dark">{p.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;
