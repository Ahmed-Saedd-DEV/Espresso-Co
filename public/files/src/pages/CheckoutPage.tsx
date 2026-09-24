import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderApi } from '../api/orders';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export function CheckoutPage() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { push } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!items.length) return;
    setSubmitting(true);

    try {
      await orderApi.createOrder({
        items: items.map((item) => ({
          productId: Number(item.id),
          quantity: item.quantity,
        })),
      });
      await clearCart();
      navigate('/orders');
    } catch (error) {
      console.error('Order creation failed', error);
      push({
        title: 'Checkout issue',
        description: 'Unable to place the order right now. Please check your cart and try again.',
        tone: 'danger',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="mx-auto max-w-[1360px] px-5 md:px-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">
              <span>Direct Atelier Order</span>
              <span className="text-[#d1c4be]">/</span>
              <span className="text-[#807570]">Dispatch 049-Milan</span>
            </div>
            <h1 className="mt-2 font-serif text-[40px] text-[#231a12]">Your Basket &amp; Checkout</h1>
          </div>

          <div className="inline-flex items-center gap-3 rounded-full bg-[#fff1e8] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#000000] text-[10px] font-bold text-white">1</span>
            <span>Cart Review</span>
            <span className="h-px w-5 bg-[#d1c4be]" />
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fdebde] text-[10px] font-bold text-[#4e4540]">2</span>
            <span>Order Confirmation</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex items-start gap-3 rounded-[20px] bg-[#fff1e8] p-4">
              <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#ba7334]">verified</span>
              <div>
                <div className="text-[13px] font-semibold text-[#231a12]">Artisanal Direct Roasting Fulfillment</div>
                <p className="mt-1 text-[14px] leading-6 text-[#4e4540]">
                  Pending orders can be cancelled anytime before roast scheduling begins directly from your{' '}
                  <a href="/orders" className="font-semibold text-[#231a12] underline underline-offset-2">
                    Orders page
                  </a>
                  .
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-serif text-[28px] text-[#231a12]">Shipping details</h2>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{items.length} items</span>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Contact</div>
                  <input value={user?.email ?? 'customer@example.com'} readOnly className="h-12 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                </div>

                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Shipping address</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={user?.name?.split(' ')[0] ?? 'Julian'} readOnly className="h-12 rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                    <input value={user?.name?.split(' ')[1] ?? 'Vance'} readOnly className="h-12 rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                    <input value="Via Brera 22" readOnly className="h-12 rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none md:col-span-2" />
                    <input value="Milan" readOnly className="h-12 rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                    <input value="20121" readOnly className="h-12 rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Payment method</div>
                  <div className="flex items-center justify-between rounded-xl bg-[#fff1e8] p-4 text-[15px] text-[#231a12]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[22px] text-[#ba7334]">credit_card</span>
                      <span>Apple Pay ending in 2046</span>
                    </div>
                    <span className="rounded-full bg-white px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]">Secure</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
              <h2 className="font-serif text-[28px] text-[#231a12]">Order summary</h2>

              <div className="mt-5 space-y-4 text-[15px] text-[#4e4540]">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-semibold text-[#231a12]">${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-3">
                  <span>Direct Roastery Fulfillment</span>
                  <span className="rounded-full bg-[#fff1e8] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">Included</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span>Estimated Taxes</span>
                  <span className="font-semibold text-[#231a12]">$0.00</span>
                </div>
              </div>

              <div className="mt-6 border-t border-[#e8dfd5] pt-5">
                <div className="flex items-center justify-between text-[18px] font-semibold text-[#231a12]">
                  <span>Total order value</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button type="button" disabled={submitting || !items.length} onClick={() => void handleSubmit()} className="mt-6 w-full rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting ? 'Placing Order...' : `Place Order • $${subtotal.toFixed(2)}`}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
