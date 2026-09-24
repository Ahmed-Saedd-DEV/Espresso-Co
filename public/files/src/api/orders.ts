import { apiGet, apiPatch, apiPost } from './client';
import type { Order } from '../types/order';

export interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
  };
}

export const orderApi = {
  getOrders: () => apiGet<OrdersResponse>('/orders'),
  getOrder: (id: string) => apiGet<Order>(`/orders/${id}`),
  createOrder: (payload: { items: Array<{ productId: number; quantity: number }> }) => apiPost<Order>('/orders', payload),
  cancelOrder: (id: string) => apiPatch<Order>(`/orders/${id}`, { status: 'CANCELLED' }),
};
