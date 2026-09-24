import { apiDelete, apiGet, apiPatch, apiPost } from './client';

export interface CartApiItem {
  cartId: number;
  productId: number;
  quantity: number;
}

export interface CartApiResponse {
  id: number;
  userId: number;
  items: CartApiItem[];
}

export const cartApi = {
  getCart: () => apiGet<CartApiResponse>('/cart'),
  addToCart: (payload: { productId: number; quantity: number }) => apiPost<CartApiItem>('/cart', payload),
  updateCartItem: (productId: string, payload: { quantity: number }) => apiPatch<CartApiItem>(`/cart/${productId}`, payload),
  removeCartItem: (productId: string) => apiDelete<{ message: string }>(`/cart/${productId}`),
};
