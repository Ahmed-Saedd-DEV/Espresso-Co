import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { orderApi } from '../api/orders';
import { OrderCancellationModal } from '../components/ui/OrderCancellationModal';
import { useToast } from '../components/ui/Toast';
import type { Order } from '../types/order';

const statusClasses: Record<string, string> = {
  PENDING: 'bg-[#faf2ea] text-[#c27a3a]',
  PROCESSING: 'bg-[#eaf3ff] text-[#2f6f9f]',
  SHIPPED: 'bg-[#f3ebff] text-[#6f4dbd]',
  DELIVERED: 'bg-[#eef3ef] text-[#4a6b53]',
  CANCELLED: 'bg-[#fdecec] text-[#9a2c2c]',
};

export function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCancellationOpen, setCancellationOpen] = useState(false);
  const navigate = useNavigate();
  const { push } = useToast();

  useEffect(() => {
    if (!id) return;

    const loadOrder = async () => {
      try {
        const nextOrder = await orderApi.getOrder(id);
        setOrder(nextOrder);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    void loadOrder();
  }, [id]);

  const handleCancel = async () => {
    if (!id) return;

    try {
      const updated = await orderApi.cancelOrder(id);
      setOrder(updated);
      setCancellationOpen(false);
    } catch (error) {
      console.error('Cancellation failed', error);
      setCancellationOpen(false);
      push({
        title: 'Cancellation unavailable',
        description: 'This order cannot be cancelled in its current status.',
        tone: 'warning',
      });
    }
  };

  if (loading) {
    return <main className="bg-[#fff8f5] px-5 py-20 text-center text-[#4e4540]">Loading order...</main>;
  }

  if (!order) {
    return <main className="bg-[#fff8f5] px-5 py-20 text-center text-[#231a12]">Order not found.</main>;
  }

  const total = typeof order.total === 'number' ? order.total : Number(order.total ?? 0);
  const itemCount = order.items?.length ?? 0;
  const statusClass = statusClasses[String(order.status)] ?? statusClasses.PENDING;

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="mx-auto max-w-[1360px] px-5 md:px-12">
        <nav className="mb-5 flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
          <button type="button" onClick={() => navigate('/')} className="hover:text-[#231a12]">Home</button>
          <span>/</span>
          <button type="button" onClick={() => navigate('/account')} className="hover:text-[#231a12]">Account</button>
          <span>/</span>
          <button type="button" onClick={() => navigate('/orders')} className="hover:text-[#231a12]">Orders</button>
          <span>/</span>
          <span className="text-[#231a12]">#{order.id}</span>
        </nav>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-[40px] text-[#231a12]">Order #{order.id}</h1>
              <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.12em] ${statusClass}`}>
                {order.status}
              </span>
            </div>
            <div className="mt-2 text-[13px] uppercase tracking-[0.12em] text-[#4e4540]">
              Placed {new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          </div>
          {order.status === 'PENDING' && (
            <button
              type="button"
              onClick={() => setCancellationOpen(true)}
              className="rounded-lg bg-[#ba1a1a] px-4 py-2 text-[13px] font-semibold text-white"
            >
              Cancel Order
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-[24px] border border-[#e8dfd5] bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-serif text-[28px] text-[#231a12]">Curated selections</h2>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{itemCount} item{itemCount === 1 ? '' : 's'}</span>
              </div>

              <div className="space-y-4">
                {(order.items ?? []).map((item) => (
                  <article key={`${order.id}-${item.name}`} className="flex flex-col gap-4 rounded-xl bg-[#fff1e8] p-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-20 w-20 overflow-hidden rounded-lg bg-[#fdebde]">
                        <img src={item.image ?? 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80'} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Artisanal selection</div>
                        <h3 className="mt-1 text-[20px] font-semibold text-[#231a12]">{item.name}</h3>
                        <div className="mt-2 text-[13px] text-[#4e4540]">Qty: {item.quantity} • ${Number(item.price ?? 0).toFixed(2)} each</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Subtotal</div>
                      <div className="mt-1 text-[24px] font-semibold text-[#231a12]">${(Number(item.price ?? 0) * item.quantity).toFixed(2)}</div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <section className="rounded-[24px] border border-[#e8dfd5] bg-white p-5 shadow-sm">
              <h2 className="font-serif text-[28px] text-[#231a12]">Order settlement</h2>
              <div className="mt-5 space-y-3 text-[15px] text-[#4e4540]">
                <div className="flex items-center justify-between">
                  <span>Items subtotal</span>
                  <span className="font-semibold text-[#231a12]">${total.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Roastery direct fulfillment</span>
                  <span className="rounded-full bg-[#fff1e8] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">Included</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated taxes</span>
                  <span className="font-semibold text-[#231a12]">$0.00</span>
                </div>
              </div>
              <div className="mt-5 border-t border-[#e8dfd5] pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-[18px] font-semibold text-[#231a12]">Total amount</span>
                  <span className="text-[28px] font-semibold text-[#231a12]">${total.toFixed(2)}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
      <OrderCancellationModal orderId={`#${order.id}`} isOpen={isCancellationOpen} onClose={() => setCancellationOpen(false)} onConfirm={handleCancel} />
    </main>
  );
}
