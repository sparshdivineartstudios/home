import { useEffect, useState } from "react";
import PhotoGallery from "@/components/PhotoGallery";
import type { Memory } from "@/lib/api";
import { productsService } from "@/services/productsService";
import { useAuth } from "@/contexts/AuthContext";

// Demo page: list real products from backend and open gallery for selected product
export default function DriveDemo() {
  const { token } = useAuth();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    productsService.getAllProducts()
      .then((list) => {
        if (cancelled) return;
        setProducts(list as any[]);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || 'Failed to load products');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const openGalleryForProduct = (product: any) => {
    // Map product to `Memory` shape expected by PhotoGallery
    const memory: Memory = {
      id: product._id || product.id,
      title: product.name || product.title || 'Product',
      description: product.description || '',
      date: product.createdAt || new Date().toISOString(),
      tags: [product.category || 'product'],
      driveFolderId: product.driveFolderId || undefined,
    };
    setSelectedMemory(memory);
  };

  if (selectedMemory) {
    return <PhotoGallery memory={selectedMemory} onBack={() => setSelectedMemory(null)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Products — Open Drive Gallery</h1>

        {loading && <p className="text-center">Loading products…</p>}
        {error && <p className="text-center text-destructive">{error}</p>}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {products.map((p: any) => (
              <div key={p._id || p.id} className="bg-card p-4 rounded shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{p.category} • {p.price}</p>
                </div>
                <div>
                  <button className="btn-primary px-3 py-1 rounded" onClick={() => openGalleryForProduct(p)}>
                    View Photos
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}