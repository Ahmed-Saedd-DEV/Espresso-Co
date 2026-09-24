import { apiGet } from './client';
import type { Product } from '../types/product';

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

function buildQueryString(params: Record<string, string | number | boolean | undefined>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    searchParams.set(key, String(value));
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

export const productApi = {
  getProducts: (params: Record<string, string | number | boolean | undefined> = {}) =>
    apiGet<ProductsResponse>(`/products${buildQueryString(params)}`),
  getProduct: (id: string) => apiGet<Product>(`/products/${id}`),
};
