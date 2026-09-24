import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderApi } from '../api/orders';
import type { Order } from '../types/order';

export function AccountPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await orderApi.getOrders();
        const data = response.data ?? [];
        // Ensure newest-first ordering by createdAt
        data.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    void load();
  }, []);

  const firstName = (user?.name ?? '').split(' ')[0] ?? '';
  const lastName = ((user?.name ?? '').split(' ').slice(1).join(' ')) ?? '';

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="w-full bg-[#fff1e8]/70 py-10">
        <div className="mx-auto max-w-[1360px] px-5 md:px-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                <span>Client Portal · Private Atelier</span>
                {user?.verified ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-[#eef3ef] px-2.5 py-1 text-[#4a6b53]">
                    <span className="h-2 w-2 rounded-full bg-[#4a6b53]" /> Verified Member
                  </span>
                ) : null}
                <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[#ba7334]">{user?.role === 'admin' ? 'Admin' : 'Customer'}</span>
              </div>
              <h1 className="mt-3 font-serif text-[40px] text-[#231a12]">{user?.name ?? ''}</h1>
              <p className="mt-2 max-w-2xl text-[16px] leading-7 text-[#4e4540]">
                Personal atelier allocations, cupping notes, and bespoke dispatch schedules for your private reserve.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-3 text-[13px] text-[#4e4540] shadow-sm">
              <span className="material-symbols-outlined text-[18px] text-[#4e4540]">info</span>
              <span>{user?.role === 'admin' ? 'Administrator · Full access' : 'Standard Customer · Catalog, Cart & Order History access.'}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[1360px] px-5 md:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4 space-y-5">
            <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-5 shadow-sm">
              <div className="mb-3 px-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Account management</div>
              <div className="space-y-2">
                {[
                  { label: 'Profile Information', icon: 'person', active: true },
                  { label: 'Order History', icon: 'local_shipping', count: orders.length },
                  { label: 'Security & Auth', icon: 'shield', status: user?.verified ? 'Verified' : undefined },
                ].map((item) => (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between rounded-lg p-3 ${item.active ? 'bg-[#fff1e8] text-[#231a12]' : 'bg-[#fff8f5] text-[#4e4540]'}`}
                  >
                    <span className="flex items-center gap-3 text-[14px] font-semibold">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      {item.label}
                    </span>
                    {item.count ? (
                      <span className="rounded-full bg-[#fdebde] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#231a12]">{item.count}</span>
                    ) : item.status ? (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] text-[#4a6b53]">
                        <span className="h-2 w-2 rounded-full bg-[#4a6b53]" /> {item.status}
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] bg-[#fff1e8] p-5">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Roastery Gazette Dispatch</div>
              <h3 className="mt-2 font-serif text-[24px] text-[#231a12]">Weekly Cupping Schedule</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#4e4540]">
                All single-origin beans are batch-roasted in our Milan laboratory each Tuesday. Orders placed before Monday 18:00 CET are dispatched within 24 hours of roasting.
              </p>
              <div className="mt-4 flex items-center gap-2 text-[13px] text-[#231a12]">
                <span className="material-symbols-outlined text-[18px] text-[#ba7334]">support_agent</span>
                <span>Concierge: concierge@espresso-atelier.com</span>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-6">
            <section className="rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Profile credentials</div>
                  <h2 className="mt-2 font-serif text-[30px] text-[#231a12]">{user?.name ?? ''}</h2>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {user?.verified ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef3ef] px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#4a6b53]">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      Email verified
                    </span>
                  ) : null}
                  <span className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]">Role: {user?.role === 'admin' ? 'Admin' : 'Customer'}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-[#fff8f5] p-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Registered Email</div>
                  <div className="mt-2 text-[18px] font-semibold text-[#231a12]">{user?.email ?? ''}</div>
                </div>
                <div className="rounded-xl bg-[#fff8f5] p-4">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Role</div>
                  <div className="mt-2 text-[18px] font-semibold text-[#231a12]">{user?.role === 'admin' ? 'Admin' : 'Customer'}</div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">First Name</label>
                  <input value={firstName} readOnly className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                </div>
                <div>
                  <label className="mb-2 block text-[13px] font-semibold text-[#231a12]">Last Name</label>
                  <input value={lastName} readOnly className="h-11 w-full rounded-lg border border-[#e8dfd5] bg-[#fff8f5] px-4 text-[15px] text-[#231a12] outline-none" />
                </div>
              </div>
            </section>

            <div>
              {orders.length > 0 ? (
                <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
                  {(() => {
                    const recent = orders[0];
                    const itemsWithNames = (recent.items ?? []).filter((it) => !!it.name);
                    const itemSummary = itemsWithNames.length > 0 ? itemsWithNames.map((it) => `${it.name} × ${it.quantity}`).join(', ') : (recent.orderItems && recent.orderItems.length > 0 ? `${recent.orderItems.length} item(s)` : '—');

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Active acquisition</div>
                          <span className="rounded-full bg-[#faf2ea] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#c27a3a]">{recent.status}</span>
                        </div>
                        <h3 className="mt-2 font-serif text-[28px] text-[#231a12]">Order #{recent.id}</h3>
                        <p className="mt-2 text-[15px] text-[#4e4540]">{itemSummary}</p>
                        <div className="mt-5 flex items-end justify-between">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Total Amount</div>
                            <div className="mt-1 text-[22px] font-semibold text-[#231a12]">${Number(recent.total).toFixed(2)}</div>
                          </div>
                          <a href={`/orders/${recent.id}`} className="text-[13px] font-semibold text-[#231a12] underline underline-offset-2">View &amp; Manage Order</a>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
                  <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Active acquisition</div>
                  <div className="mt-2 text-[15px] text-[#4e4540]">No orders yet — <Link to="/shop" className="underline">start shopping</Link></div>
                </div>
              )}
            </div>

            <section className="rounded-[24px] border border-[#e8dfd5] bg-white p-6 shadow-sm">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Recent activity</div>
              <div className="mt-4 space-y-4">
                {ordersLoading ? (
                  <div className="text-[14px] text-[#4e4540]">Loading recent activity...</div>
                ) : orders.length === 0 ? (
                  <div className="text-[14px] text-[#4e4540]">No orders yet.</div>
                ) : (
                  orders.map((order) => {
                    const itemsWithNames = (order.items ?? []).filter((it) => !!it.name);
                    const summary = itemsWithNames.length > 0 ? itemsWithNames.map((it) => `${it.name} × ${it.quantity}`).join(', ') : (order.orderItems && order.orderItems.length > 0 ? `${order.orderItems.length} item(s)` : '—');

                    return (
                      <div key={String(order.id)} className="flex items-center justify-between rounded-xl bg-[#fff8f5] p-4">
                        <div>
                          <div className="text-[18px] font-semibold text-[#231a12]">Order #{order.id}</div>
                          <div className="mt-1 text-[13px] text-[#4e4540]">{summary}</div>
                        </div>
                        <div className="rounded-full bg-[#fff1e8] px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">{order.status}</div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
