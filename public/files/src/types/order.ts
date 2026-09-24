export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId?: number;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string | number;
  userId?: string | number;
  status: OrderStatus;
  createdAt: string;
  total: number | string;
  items: OrderItem[];
  shippingAddress?: string;
  email?: string;
  customerName?: string;
  orderItems?: Array<{
    id?: number;
    productId: number;
    quantity: number;
    price: number | string;
  }>;
}
