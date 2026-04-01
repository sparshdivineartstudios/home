import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Product, categories, materials, colors } from "@/data/products";
import { productsService } from "@/services/productsService";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    priceNum: 0,
    description: '',
    material: '',
    size: '',
    color: '',
    inStock: true,
    images: [] as string[]
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadProducts();
  }, [user, navigate]);

  const loadProducts = async () => {
    try {
      const prods = await productsService.getAllProducts();
      setProducts(prods);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      price: '',
      priceNum: 0,
      description: '',
      material: '',
      size: '',
      color: '',
      inStock: true,
      images: []
    });
    setImageFiles([]);
  };

  const handleCreate = async () => {
    if (!user) return;
    const token = localStorage.getItem("sparsh_token");
    if (!token) return;

    try {
      setUploading(true);
      const productData = { ...formData };
      const newProduct = await productsService.createProduct(productData, token);

      // Upload images if any
      for (const file of imageFiles) {
        await productsService.uploadProductImage(newProduct._id, file, token);
      }

      toast({ title: "Success", description: "Product created successfully" });
      setIsCreateDialogOpen(false);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = async () => {
    if (!editingProduct || !user) return;
    const token = localStorage.getItem("sparsh_token");
    if (!token) return;

    try {
      setUploading(true);
      await productsService.updateProduct(editingProduct._id, formData, token);

      // Upload new images if any
      for (const file of imageFiles) {
        await productsService.uploadProductImage(editingProduct._id, file, token);
      }

      toast({ title: "Success", description: "Product updated successfully" });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      resetForm();
      loadProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!user) return;
    const token = localStorage.getItem("sparsh_token");
    if (!token) return;

    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productsService.deleteProduct(productId, token);
      toast({ title: "Success", description: "Product deleted successfully" });
      loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      priceNum: product.priceNum,
      description: product.description,
      material: product.material,
      size: product.size,
      color: product.color,
      inStock: product.inStock,
      images: product.images
    });
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = (files: FileList | null) => {
    if (files) {
      setImageFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeImageFile = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-32 text-center section-padding">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-64"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-20 sm:pt-24">
        <div className="container-custom px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-heading text-3xl font-bold text-foreground">Admin Panel</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Product</DialogTitle>
                </DialogHeader>
                <ProductForm
                  formData={formData}
                  setFormData={setFormData}
                  imageFiles={imageFiles}
                  onImageUpload={handleImageUpload}
                  removeImageFile={removeImageFile}
                  onSubmit={handleCreate}
                  submitting={uploading}
                />
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product._id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(product)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product._id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square mb-4 overflow-hidden rounded-md">
                    <img
                      src={product.images[0] || '/placeholder.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gold-dark">{product.price}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.images.length} image{product.images.length !== 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            formData={formData}
            setFormData={setFormData}
            imageFiles={imageFiles}
            onImageUpload={handleImageUpload}
            removeImageFile={removeImageFile}
            onSubmit={handleEdit}
            submitting={uploading}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

const ProductForm = ({
  formData,
  setFormData,
  imageFiles,
  onImageUpload,
  removeImageFile,
  onSubmit,
  submitting
}: {
  formData: any;
  setFormData: (data: any) => void;
  imageFiles: File[];
  onImageUpload: (files: FileList | null) => void;
  removeImageFile: (index: number) => void;
  onSubmit: () => void;
  submitting: boolean;
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Product name"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Category</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.filter(c => c !== 'All').map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Price</label>
          <Input
            value={formData.price}
            onChange={(e) => {
              const price = e.target.value;
              const numMatch = price.match(/₹?(\d+)/);
              const priceNum = numMatch ? parseInt(numMatch[1]) : 0;
              setFormData({ ...formData, price, priceNum });
            }}
            placeholder="₹1,299"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Material</label>
          <Select value={formData.material} onValueChange={(value) => setFormData({ ...formData, material: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {materials.filter(m => m !== 'All').map((mat) => (
                <SelectItem key={mat} value={mat}>{mat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Size</label>
          <Input
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="Medium (250g)"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Color</label>
          <Select value={formData.color} onValueChange={(value) => setFormData({ ...formData, color: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              {colors.filter(c => c !== 'All').map((col) => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Product description"
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Images</label>
        <div className="mt-2">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => onImageUpload(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <Upload size={16} className="mr-2" />
            Upload Images
          </label>
        </div>
        {imageFiles.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {imageFiles.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Upload ${index + 1}`}
                  className="w-16 h-16 object-cover rounded border"
                />
                <button
                  onClick={() => removeImageFile(index)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => {}}>
          Cancel
        </Button>
        <Button onClick={onSubmit} disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </div>
  );
};

export default Admin;