import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { productApi } from '../api/products';
import { reviewApi, type ProductReview } from '../api/reviews';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { normalizeErrorMessage } from '../utils/validation';
import type { Product } from '../types/product';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80';

export function ProductPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const { push } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isEditingReview, setIsEditingReview] = useState(false);

  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      try {
        const nextProduct = await productApi.getProduct(id);
        setProduct(nextProduct);
      } catch {
        setProduct(null);
      }
    };

    const loadReviews = async () => {
      try {
        const nextReviews = await reviewApi.getProductReviews(id);
        setReviews(nextReviews);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    void loadProduct();
    void loadReviews();
  }, [id]);

  const productReviews = useMemo(
    () => reviews.filter((review) => Number(review.productId) === Number(id)),
    [reviews, id],
  );

  const currentUserReview = user
    ? productReviews.find((review) => String(review.userId ?? '') === String(user.id))
    : undefined;

  const averageRating = productReviews.length
    ? productReviews.reduce((total, review) => total + Number(review.rating || 0), 0) / productReviews.length
    : Number(product?.rating ?? 4.8);

  const handleReviewSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id) return;

    setReviewError('');
    setIsSubmittingReview(true);

    try {
      const response = await reviewApi.createReview(id, { rating, comment });
      setReviews((current) => [response, ...current.filter((review) => Number(review.productId) !== Number(id))]);
      setComment('');
      setRating(5);
      push({
        title: 'Review submitted',
        description: 'Thanks for sharing your feedback.',
        tone: 'success',
      });
    } catch (error) {
      const message = normalizeErrorMessage(
        error instanceof Error ? error.message : undefined,
        error && typeof error === 'object' && 'payload' in error ? (error as { payload?: unknown }).payload : undefined,
      );
      setReviewError(message);
      push({
        title: 'Review failed',
        description: message,
        tone: 'danger',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!id || !currentUserReview) return;

    setReviewError('');
    setIsSubmittingReview(true);

    try {
      const updated = await reviewApi.updateReview(currentUserReview.id, { rating, comment });
      setReviews((current) => current.map((r) => (String(r.id) === String(updated.id) ? updated : r)));
      push({ title: 'Review updated', description: 'Your review was updated.', tone: 'success' });
      setIsEditingReview(false);
    } catch (error) {
      const message = normalizeErrorMessage(
        error instanceof Error ? error.message : undefined,
        error && typeof error === 'object' && 'payload' in error ? (error as { payload?: unknown }).payload : undefined,
      );
      setReviewError(message);
      push({ title: 'Update failed', description: message, tone: 'danger' });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!currentUserReview) return;
    if (!window.confirm('Delete your review?')) return;

    try {
      await reviewApi.deleteReview(currentUserReview.id);
      setReviews((current) => current.filter((r) => String(r.id) !== String(currentUserReview.id)));
      push({ title: 'Review deleted', description: 'Your review was removed.', tone: 'success' });
      setComment('');
      setRating(5);
      setIsEditingReview(false);
    } catch (error) {
      const message = normalizeErrorMessage(
        error instanceof Error ? error.message : undefined,
        error && typeof error === 'object' && 'payload' in error ? (error as { payload?: unknown }).payload : undefined,
      );
      push({ title: 'Delete failed', description: message, tone: 'danger' });
    }
  };

  if (loading) {
    return <main className="bg-[#fff8f5] px-5 py-20 text-center text-[#4e4540]">Loading product...</main>;
  }

  if (!product) {
    return <main className="bg-[#fff8f5] px-5 py-20 text-center text-[#231a12]">Product not found.</main>;
  }

  const notes = [
    'Floral',
    'Citrus',
    'Tea-like',
    product.name.includes('Espresso') ? 'Chocolate' : 'Jasmine',
  ];

  const details = [
    { label: 'Origin', value: 'Single origin lot' },
    { label: 'Process', value: 'Carefully selected' },
    { label: 'Roast', value: 'Light-Medium' },
    { label: 'Variety', value: 'Signature selection' },
  ];

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="mx-auto max-w-[1360px] px-5 md:px-12">
        <nav className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
          <Link to="/" className="hover:text-[#231a12]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#231a12]">Shop</Link>
          <span>/</span>
          <span className="text-[#231a12]">{product.name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-[24px] bg-[#fdebde]">
              <img src={product.image ?? FALLBACK_IMAGE} alt={product.name} className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
              <div className="mb-3 inline-flex rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">
                {product.category ?? 'Coffee'}
              </div>
              <h1 className="font-serif text-[36px] tracking-[-0.03em] text-[#231a12]">{product.name}</h1>
              <p className="mt-2 italic text-[16px] text-[#4e4540]">{product.subtitle ?? 'Freshly curated for a refined daily ritual.'}</p>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1 text-[#ba7334]">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                  <span className="text-[13px] font-semibold">{averageRating.toFixed(1)}</span>
                </div>
                <span className="text-[13px] text-[#4e4540]">{productReviews.length} reviews</span>
              </div>

              <div className="mt-6 flex items-baseline gap-3">
                <span className="text-[34px] font-semibold text-[#231a12]">${Number(product.price ?? 0).toFixed(2)}</span>
                <span className="text-[13px] text-[#4e4540]">Free shipping over $50</span>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => void addItem({
                    id: String(product.id),
                    name: product.name,
                    category: product.category ?? 'Coffee',
                    image: product.image ?? FALLBACK_IMAGE,
                    price: Number(product.price ?? 0),
                  })}
                  className="w-full rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-white"
                >
                  Add to Cart
                </button>
                <button className="w-full rounded-lg border border-[#e8dfd5] bg-white px-6 py-3.5 text-[13px] font-semibold text-[#231a12]">
                  Save for Later
                </button>
              </div>

              <div className="mt-8 rounded-xl bg-[#fff1e8] p-4">
                <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Taste Notes</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {notes.map((note) => (
                    <span key={note} className="rounded-full border border-[#e8dfd5] bg-white px-2.5 py-1 text-[12px] text-[#231a12]">
                      {note}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Product Story</div>
            <h2 className="mt-3 font-serif text-[28px] text-[#231a12]">Why it stands out</h2>
            <p className="mt-4 text-[16px] leading-7 text-[#4e4540]">{product.description ?? 'A carefully selected product from our roastery.'}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {details.map((detail) => (
                <div key={detail.label} className="rounded-xl bg-[#fff8f5] p-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{detail.label}</div>
                  <div className="mt-2 text-[18px] font-semibold text-[#231a12]">{detail.value}</div>
                </div>
              ))}
            </div>
          </div>

          <aside className="lg:col-span-4 rounded-[24px] bg-[#fdebde] p-6">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Roaster Notes</div>
            <h3 className="mt-3 font-serif text-[28px] text-[#231a12]">Balanced, floral, structured</h3>
            <p className="mt-3 text-[15px] leading-7 text-[#4e4540]">
              Cup at 93°C with a silky body and bright aromatic top note. Ideal for pour-over, Chemex, or a precise espresso profile.
            </p>
          </aside>
        </section>

        <section className="mt-10 rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Reviews</div>
              <h2 className="mt-2 font-serif text-[30px] text-[#231a12]">Customer feedback</h2>
            </div>
            <div className="rounded-full bg-[#fff1e8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ba7334]">
              {productReviews.length} total
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {user && currentUserReview ? (
              isEditingReview ? (
                <form onSubmit={handleEditSubmit} className="rounded-2xl border border-[#e8dfd5] bg-[#fff8f5] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-[13px] font-semibold text-[#231a12]">Your rating</label>
                    <div className="flex items-center gap-1 text-[#ba7334]">
                      {Array.from({ length: 5 }).map((_, index) => {
                        const value = index + 1;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => setRating(value)}
                            className="material-symbols-outlined text-[22px] transition hover:scale-110"
                            aria-label={`Rate ${value} out of 5`}
                          >
                            {value <= rating ? 'star' : 'star_outline'}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Comment</label>
                  <textarea
                    value={comment}
                    onChange={(event) => setComment(event.target.value)}
                    rows={4}
                    maxLength={1000}
                    placeholder="Tell us what stood out about this coffee..."
                    className="w-full rounded-xl border border-[#e8dfd5] bg-white px-4 py-3 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                  />

                  {reviewError && (
                    <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {reviewError}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setIsEditingReview(false); setComment(''); setRating(5); }} className="rounded-lg border border-[#e8dfd5] bg-white px-4 py-2 text-[13px] font-semibold text-[#231a12]">Cancel</button>
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="rounded-lg bg-[#000000] px-5 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmittingReview ? 'Saving…' : 'Save review'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="rounded-2xl border border-[#e8dfd5] bg-[#fff8f5] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Your review</div>
                      <div className="mt-2 flex items-center gap-1 text-[#ba7334]">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span key={index} className={`material-symbols-outlined text-[18px] ${index < Number(currentUserReview.rating) ? '' : 'text-[#d7c8ba]'}`}>
                            star
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setIsEditingReview(true); setRating(Number(currentUserReview.rating)); setComment(currentUserReview.comment ?? ''); }} className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[12px] font-semibold text-[#231a12]">Edit</button>
                      <button type="button" onClick={() => void handleDeleteReview()} className="rounded-lg bg-[#000000] px-3 py-2 text-[12px] font-semibold text-white">Delete</button>
                    </div>
                  </div>
                  <p className="mt-3 text-[15px] leading-7 text-[#4e4540]">{currentUserReview.comment || 'This customer did not leave a written review.'}</p>
                </div>
              )
            ) : user ? (
              <form onSubmit={handleReviewSubmit} className="rounded-2xl border border-[#e8dfd5] bg-[#fff8f5] p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <label className="text-[13px] font-semibold text-[#231a12]">Your rating</label>
                  <div className="flex items-center gap-1 text-[#ba7334]">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const value = index + 1;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setRating(value)}
                          className="material-symbols-outlined text-[22px] transition hover:scale-110"
                          aria-label={`Rate ${value} out of 5`}
                        >
                          {value <= rating ? 'star' : 'star_outline'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Comment</label>
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  rows={4}
                  maxLength={1000}
                  placeholder="Tell us what stood out about this coffee..."
                  className="w-full rounded-xl border border-[#e8dfd5] bg-white px-4 py-3 text-[15px] text-[#231a12] outline-none transition focus:border-[#ba7334]"
                />

                {reviewError && (
                  <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {reviewError}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[#4e4540]">{comment.trim().length}/1000 characters</span>
                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="rounded-lg bg-[#000000] px-5 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmittingReview ? 'Submitting…' : 'Submit review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="rounded-2xl border border-[#e8dfd5] bg-[#fff8f5] p-5 text-[15px] text-[#4e4540]">
                Sign in to leave a review for this product.
              </div>
            )}

            <div className="mt-6 space-y-4">
              {productReviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#e8dfd5] bg-[#fff8f5] p-5 text-[15px] text-[#4e4540]">
                  No reviews yet for this product.
                </div>
              ) : (
                productReviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-[#e8dfd5] bg-[#fff8f5] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[13px] font-semibold text-[#231a12]">{review.user?.name ?? 'Customer'}</div>
                        <div className="mt-1 flex items-center gap-1 text-[#ba7334]">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span key={index} className={`material-symbols-outlined text-[18px] ${index < Number(review.rating || 0) ? '' : 'text-[#d7c8ba]'}`}>
                              star
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Just now'}
                      </span>
                    </div>
                    {review.comment ? <p className="mt-3 text-[15px] leading-7 text-[#4e4540]">{review.comment}</p> : null}
                  </article>
                ))
              )}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
