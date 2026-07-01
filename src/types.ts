export type Screen = 'home' | 'shop' | 'product' | 'cart' | 'checkout' | 'admin' | 'auth';

export interface Product {
  id: string;
  name: string;
  arabicName?: string;
  description: string;
  arabicDescription?: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string; // 'coffee' | 'sweets' | 'bakery' | 'specialty'
  tags: string[];
  isPopular?: boolean;
  calories: number;
  ingredients: string[];
  deliveryTime: string;
  sizes?: string[]; // e.g., ['Regular', 'Large'] for coffee or ['Single', 'Box of 6', 'Box of 12'] for donuts
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  arabicComment?: string;
  date: string;
  productName: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: {
    productName: string;
    quantity: number;
    size: string;
    price: number;
  }[];
  totalAmount: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered';
  date: string;
  shippingAddress: string;
  paymentMethod: string;
}

export interface DashboardStats {
  monthlyRevenue: number;
  revenueChange: number; // percentage
  totalOrders: number;
  ordersChange: number;
  newCustomers: number;
  customersChange: number;
  recentOrders: Order[];
  recentReviews: Review[];
}
