import { Product } from '@/types';

export interface ProductsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export const fetchProducts = async (
  accessToken: string | null,
): Promise<Product[]> => {
  const url = 'https://electrostore-ofl1.onrender.com/api/products/';
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (accessToken && accessToken !== 'null' && accessToken !== 'undefined') {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, { headers });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to fetch products');
  }
  const data = await response.json();
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.results)) return data.results;
  return [];
};