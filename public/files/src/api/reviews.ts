import { apiGet, apiPost } from './client';
import { apiPatch, apiDelete } from './client';

export interface ProductReview {
  id: number | string;
  productId: number | string;
  userId?: number | string;
  rating: number;
  comment?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id?: number | string;
    name?: string;
    email?: string;
  };
}

export interface ProductReviewsResponse {
  data: ProductReview[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
  };
}

export const reviewApi = {
  getProductReviews: (productId: string | number) =>
    apiGet<ProductReviewsResponse>(`/reviews?productId=${Number(productId)}`).then((res) => res.data),
  createReview: (productId: string | number, data: { rating: number; comment?: string }) =>
    apiPost<ProductReview>('/reviews', {
      productId: Number(productId),
      rating: Number(data.rating),
      comment: data.comment?.trim() || undefined,
    }),
  updateReview: (id: string | number, data: { rating?: number; comment?: string }) =>
    apiPatch<ProductReview>(`/reviews/${id}`, data),
  deleteReview: (id: string | number) => apiDelete<{ message: string }>(`/reviews/${id}`),
};
