import { Product } from '@/data/products';

const API_BASE = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com/api';

export interface DrivePhoto {
  id: string;
  name: string;
  mimeType: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  webContentLink?: string;
  webViewLink?: string;
}

export const productsService = {
  async getAllProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  },
  // Fetch images for a product by product id. Backend route: GET /api/products/:id/images
  async getProductImages(productId: string, token?: string): Promise<DrivePhoto[]> {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/products/${productId}/images`, { headers });
    if (!response.ok) throw new Error('Failed to fetch product images');
    return await response.json();
  },

  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>, token: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  async updateProduct(id: string, productData: Partial<Product>, token: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  async deleteProduct(id: string, token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to delete product');
  },

  async uploadProductImage(productId: string, imageFile: File, token: string): Promise<{ imageUrl: string; product: Product }> {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE}/products/${productId}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });
    if (!response.ok) throw new Error('Failed to upload image');
    return response.json();
  }
};