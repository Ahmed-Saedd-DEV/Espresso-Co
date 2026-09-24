import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../api/orders';
import type { Order } from '../types/order';

const statusClasses: Record<string, string> = {
  PENDING: 'bg-[#faf2ea] text-[#c27a3a]',
  PROCESSING: 'bg-[#eaf3ff] text-[#2f6f9f]',
  SHIPPED: 'bg-[#f3ebff] text-[#6f4dbd]',
  DELIVERED: 'bg-[#eef3ef] text-[#4a6b53]',
  CANCELLED: 'bg-[#fdecec] text-[#9a2c2c]',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await orderApi.getOrders();
        setOrders(response.data ?? []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="mx-auto max-w-[1360px] px-5 md:px-12">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Atelier account</div>
            <h1 className="mt-2 font-serif text-[40px] text-[#231a12]">Your orders</h1>
          </div>
          <button className="rounded-lg border border-[#e8dfd5] bg-white px-4 py-2 text-[13px] font-semibold text-[#231a12]">
            Dispatch policy
          </button>
        </div>

        {loading ? (
          <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-8 text-center text-[#4e4540]">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-8 text-center text-[#4e4540]">No orders yet.</div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const total = typeof order.total === 'number' ? order.total : Number(order.total ?? 0);
              const summary = order.items?.map((item) => `${item.name} × ${item.quantity}`).join(', ') || 'Order items';
              const date = new Date(order.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });

              return (
                <article key={String(order.id)} className="rounded-[24px] border border-[#e8dfd5] bg-white p-5 shadow-sm">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-[20px] font-semibold text-[#231a12]">#{order.id}</div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${statusClasses[String(order.status)] ?? 'bg-[#faf2ea] text-[#c27a3a]'}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="text-[18px] font-semibold text-[#231a12]">${total.toFixed(2)}</div>
                  </div>

                  <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="text-[15px] text-[#4e4540]">{summary}</div>
                      <div className="mt-2 text-[12px] uppercase tracking-[0.12em] text-[#4e4540]">{date}</div>
                    </div>
                    <Link to={`/orders/${order.id}`} className="rounded-lg bg-[#000000] px-4 py-2 text-[13px] font-semibold text-white">View details</Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
