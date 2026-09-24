import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Order, OrderStatus } from '../types/order';
import type { Product } from '../types/product';

export interface AdminCategory {
  id: number;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  products?: Product[];
}

export interface AdminReview {
  id: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: number; name: string; email: string };
  product: { id: number; name: string };
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
  totalUsers: number;
  totalPages: number;
  currentPage: number;
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

async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const storageToken = localStorage.getItem('espresso-access-token');
  const headers = new Headers();

  if (storageToken) {
    headers.set('Authorization', `Bearer ${storageToken}`);
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:5000'}${path}`, {
    method: 'POST',
    headers,
    body: formData,
    credentials: 'include',
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => undefined) : undefined;

  if (!response.ok) {
    const message = payload?.message ?? 'Request failed.';
    throw new Error(message);
  }

  return (payload ?? (null as T)) as T;
}

export const adminApi = {
  getProducts: (params: Record<string, string | number | boolean | undefined> = {}) =>
    apiGet<{ data: Product[]; total: number; page: number; limit: number }>(`/admin/products${buildQueryString(params)}`),
  createProduct: (data: Record<string, string | number | null | undefined>) =>
    apiPost<Product>('/admin/products', data),
  updateProduct: (id: string | number, data: Record<string, string | number | null | undefined>) =>
    apiPatch<Product>(`/admin/products/${id}`, data),
  deleteProduct: (id: string | number) => apiDelete<null>(`/admin/products/${id}`),
  addProductImage: (id: string | number, file: File) => {
    const formData = new FormData();
    formData.append('images', file);
    return apiUpload<{ id?: number; url?: string }>(`/admin/products/${id}/images`, formData);
  },
  deleteProductImage: (id: string | number, imageId: string | number) =>
    apiDelete<null>(`/admin/products/${id}/images/${imageId}`),
  getCategories: (params: Record<string, string | number | boolean | undefined> = {}) =>
    apiGet<{ data: AdminCategory[]; pagination: { page: number; limit: number; totalPages: number; totalRecords: number } }>(`/categories${buildQueryString(params)}`),
  createCategory: (data: { name: string }) => apiPost<AdminCategory>('/admin/categories', data),
  updateCategory: (id: string | number, data: { name: string }) => apiPatch<AdminCategory>(`/admin/categories/${id}`, data),
  deleteCategory: (id: string | number) => apiDelete<null>(`/admin/categories/${id}`),
  getUsers: (params: Record<string, string | number | boolean | undefined> = {}) =>
    apiGet<AdminUsersResponse>(`/admin/users${buildQueryString(params)}`),
  getReviews: (params: Record<string, string | number | boolean | undefined> = {}) =>
    apiGet<{ data: AdminReview[]; pagination: { page: number; limit: number; totalPages: number; totalRecords: number } }>(`/admin/reviews${buildQueryString(params)}`),
  deleteReview: (id: string | number) => apiDelete<null>(`/admin/reviews/${id}`),
  bulkDeleteReviews: (ids: Array<string | number>) => apiPost<{ message: string; deletedCount: number }>('/admin/reviews/bulk-delete', { ids: ids.map(Number) }),
  updateUser: (id: string | number, data: Partial<AdminUser>) =>
    apiPatch<AdminUser>(`/admin/users/${id}`, data),
  getOrders: (params: Record<string, string | number | boolean | undefined> = {}) =>
    apiGet<{ data: Order[]; pagination: { page: number; limit: number; totalPages: number; totalRecords: number } }>(`/admin/orders${buildQueryString(params)}`),
  updateOrderStatus: (id: string | number, status: OrderStatus) =>
    apiPatch<Order>(`/admin/orders/${id}`, { status }),
  cancelOrder: (id: string | number) => apiDelete<Order>(`/admin/orders/${id}`),
};
