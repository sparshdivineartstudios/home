// API types for Google Drive integration
export interface MemoryPhoto {
  id: string;
  name: string;
  imageUrl: string;
  thumbnailUrl: string;
  mimeType: string;
  size?: number;
  createdTime?: string;
  modifiedTime?: string;
}

export interface Memory {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  driveFolderId?: string;
}

// API functions for Google Drive integration
const API_BASE = import.meta.env.VITE_API_URL || 'https://home-8zob.onrender.com/api';

export const getMemoryPhotos = async (memoryId: string, token: string): Promise<MemoryPhoto[]> => {
  // Calls backend product images route: /api/products/:id/images
  const response = await fetch(`${API_BASE}/products/${memoryId}/images`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch memory photos');
  }

  return response.json();
};

export const getMemories = async (token: string): Promise<Memory[]> => {
  const response = await fetch(`${API_BASE}/memories`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch memories');
  }

  return response.json();
};

export const createMemory = async (memoryData: Omit<Memory, 'id'>, token: string): Promise<Memory> => {
  const response = await fetch(`${API_BASE}/memories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(memoryData)
  });

  if (!response.ok) {
    throw new Error('Failed to create memory');
  }

  return response.json();
};