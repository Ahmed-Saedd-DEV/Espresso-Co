export interface Product {
  id: string | number;
  name: string;
  category?: string;
  price: number | string;
  image?: string;
  description?: string;
  subtitle?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  images?: Array<{ id?: number; url?: string }>;
}

export interface ProductFormInput {
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  description: string;
  subtitle: string;
}
