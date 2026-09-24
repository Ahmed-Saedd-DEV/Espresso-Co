import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem, pendingItemIds } = useCart();

  if (items.length === 0) {
    return (
      <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
        <section className="mx-auto max-w-[1360px] px-5 py-16 md:px-12">
          <div className="rounded-[24px] border border-[#e8dfd5] bg-white p-10 text-center shadow-sm">
            <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Atelier Basket</div>
            <h1 className="mt-3 font-serif text-[40px] text-[#231a12]">Your cart is empty</h1>
            <p className="mt-3 text-[#4e4540]">Choose a roast or patisserie to continue.</p>
            <Link to="/shop" className="mt-6 inline-block rounded-lg bg-[#000000] px-6 py-3 text-[13px] font-semibold text-white">Browse the shop</Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="mx-auto max-w-[1360px] px-5 md:px-12">
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Atelier Basket</div>
          <h1 className="mt-2 font-serif text-[40px] text-[#231a12]">Your cart</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-5">
            {items.map((item) => {
              const isPending = pendingItemIds.has(String(item.id));
              return (
                <article key={item.id} className="flex flex-col gap-4 rounded-[24px] border border-[#e8dfd5] bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-24 w-24 overflow-hidden rounded-xl bg-[#fdebde]">
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{item.category}</div>
                      <h2 className="mt-1 text-[20px] font-semibold text-[#231a12]">{item.name}</h2>
                      <div className="mt-2 flex items-center gap-3 text-[13px] text-[#4e4540]">
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" disabled={isPending} onClick={() => void removeItem(String(item.id))} className="rounded-full border border-[#e8dfd5] bg-white px-3 py-2 text-[13px] font-semibold text-[#231a12] disabled:cursor-not-allowed disabled:opacity-50">Remove</button>
                    <button type="button" disabled={isPending} onClick={() => void updateQuantity(String(item.id), item.quantity + 1)} className="rounded-full bg-[#000000] px-4 py-2 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Add one</button>
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-[24px] bg-white p-6 shadow-sm border border-[#e8dfd5]">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Order Summary</div>
              <div className="mt-5 space-y-3 text-[15px] text-[#4e4540]">
                <div className="flex items-center justify-between">
                  <span>Items subtotal</span>
                  <span className="font-semibold text-[#231a12]">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-[#231a12]">$0.00</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxes</span>
                  <span className="font-semibold text-[#231a12]">$0.00</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#e8dfd5] pt-5">
                <span className="text-[18px] font-semibold text-[#231a12]">Total</span>
                <span className="text-[28px] font-semibold text-[#231a12]">${subtotal.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="mt-6 block rounded-lg bg-[#000000] px-6 py-3.5 text-center text-[13px] font-semibold text-white">
                Proceed to checkout
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
