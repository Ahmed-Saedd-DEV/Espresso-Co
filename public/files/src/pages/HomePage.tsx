const categories = [
  { label: 'Whole Bean Coffee', count: '18 lots', icon: 'coffee' },
  { label: 'Pour Over & Gear', count: '9 implements', icon: 'water_drop' },
  { label: 'Artisanal Desserts', count: '12 bakes', icon: 'bakery_dining' },
  { label: 'Sweets & Bonbons', count: '8 selections', icon: 'cookie' },
  { label: 'Tasting Flights', count: '4 flights', icon: 'award_star' },
];

const featuredProducts = [
  {
    name: 'Yirgacheffe Washed G1',
    category: 'Whole Bean',
    price: '$24.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD019ewt-xai65ytoN-WW4-A56U6VcCke_5oId9vMs3fMFfKLu4c8WoUn0XMxhsoQG1HogRMhQVOR9CMMQyNzagh5tu2bSEHY-1dYhIJicogmrPRDaNvRpgLJPCZ--MMklrI1tCem-VzmogW_glt2lqTAgNew9xgtUEozeil9onfQiLEZT1kLarLAjo5la0sm_Fw30aVvwgnGlDroTayIAFTX4TvlG1v-wUePvfkMyta_YfliTP0bY3',
  },
  {
    name: 'Military Espresso Blend',
    category: 'Signature Blend',
    price: '$21.50',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAg0mkqSmFU_4ushDkokiwadQQfxuGW3H2ztwcN_b_2w3q42icBZnRYN96I_zI7YcGbx3UXJgGbC97FYCOd_CXQTQL_oERuuTjp5NwOmaRG2uc65HmcQBRhL6PPcwcZ1CGy46Y5hobb86w6vO_escS7BN50Z8N_BAfW7f03RnJtIaFUGtyBc6bJdxa76pLwQKYhuRUoFuC49ojgZF7OJKGCJBWLBOA36wx0sui1pSdDoPrT-KzpxLV0',
  },
  {
    name: 'Milan Brew Set',
    category: 'Gear',
    price: '$62.00',
    image:
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Pain au Chocolat Grand Cru',
    category: 'Patisserie',
    price: '$8.00',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB6TXSXcGyWccMQoSQMEAcrIRm0s6JXpF41JM89VKDfuDirzJ8vr470nVQ_tQCJMUAXE5My5cZk68PwBR9zomlzokLxWQ1RzJfBAHVouNJz-WuoPBhYHvZi_TpIt3j2aIkSIovZTl-arK7uUl8r_njmwQo0HTZNeBrqqTHvgPzMQtBtpw087beHRqTwxNBuCKYxRVYtVOP_sv7-DBwdmyqB63JeHQLQXwwxDwoJSljHXy1HozJdo32O',
  },
];

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fff5ef] via-[#fff8f5] to-[#fff8f5] pb-20 pt-8">
        <div className="mx-auto max-w-[1360px] px-5 md:px-12">
          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#fdebde] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#ba7334]">
                <span className="h-2 w-2 rounded-full bg-[#ba7334] animate-pulse" />
                Specialty Coffee & Artisanal Sweets
              </div>
              <h1 className="max-w-xl font-serif text-[38px] leading-[1.05] tracking-[-0.03em] text-[#231a12] md:text-[56px]">
                Crafted for your everyday ritual.
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-7 text-[#4e4540] md:text-[18px]">
                Ethically sourced single-origin micro-lots roasted in small batches, paired with refined French and Milanese confections made daily to enrich your morning cadence.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/shop" className="inline-flex items-center rounded-lg bg-[#000000] px-6 py-3.5 text-[13px] font-semibold text-[#ffffff] shadow-md transition hover:bg-[#231a12]">
                  Shop Coffee
                  <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
                </a>
                <a href="/shop" className="inline-flex items-center rounded-lg bg-white px-6 py-3.5 text-[13px] font-semibold text-[#231a12] shadow-sm transition hover:bg-[#fff1e8]">
                  Explore Collection
                </a>
              </div>

              <div className="mt-10 grid max-w-lg grid-cols-3 gap-4 rounded-xl bg-[#fff1e8]/80 p-4">
                <div>
                  <div className="text-[22px] font-semibold text-[#231a12]">88.5+</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]">Cup Score Avg</div>
                </div>
                <div>
                  <div className="text-[22px] font-semibold text-[#231a12]">48 hrs</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]">Roast-to-Ship</div>
                </div>
                <div>
                  <div className="text-[22px] font-semibold text-[#231a12]">100%</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]">Direct Trade</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative mx-auto max-w-[560px] overflow-hidden rounded-[28px] bg-[#fdebde] shadow-[0_25px_50px_-12px_rgba(28,19,14,0.25)]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKcRHzq1M-HkUeS3Y_D-d9V50QeE4T8HhO_i9_11oY65qV6F23jO0w7vD7x5rGz5XvFkYV8J6zU7GZ7GZ7GZ7GZ7GZ7GZ7GZ7GZ7GZ7"
                  alt="coffee ritual"
                  className="h-[540px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000]/60 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 max-w-sm rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-md sm:right-auto">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f7e5d8] text-[#ba7334]">
                      <span className="material-symbols-outlined text-[24px]">local_cafe</span>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">Signature Pairing</div>
                      <div className="mt-1 text-[18px] font-semibold text-[#231a12]">Ethiopia Yirgacheffe & Choco Twist</div>
                      <div className="text-[13px] text-[#4e4540]">Notes of bergamot, apricot & cocoa</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-[#fff8f5] py-20">
        <div className="mx-auto max-w-[1360px] px-5 md:px-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Carefully Curated</div>
              <h2 className="mt-1 font-serif text-[28px] text-[#231a12] md:text-[36px]">Curated Selections</h2>
            </div>
            <p className="max-w-xl text-[15px] text-[#4e4540]">
              Explore artisanal harvest lots and hand-tempered confections categorized to enrich your morning cadence.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((category) => (
              <div key={category.label} className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <div className="mb-7 flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fdebde] text-[#231a12]">
                    <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                  </span>
                  <span className="rounded-full bg-[#fff1e8] px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]">
                    {category.count}
                  </span>
                </div>
                <h3 className="text-[18px] font-semibold text-[#231a12]">{category.label}</h3>
                <p className="mt-2 text-[13px] text-[#4e4540]">Single-origin microlots & selections curated for ritual.</p>
                <div className="mt-5 inline-flex items-center gap-1 text-[13px] font-semibold text-[#ba7334]">
                  Explore <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#fff1e8]/60 py-20">
        <div className="mx-auto max-w-[1360px] px-5 md:px-12">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#ba7334]">Restocked This Week</div>
              <h2 className="mt-1 font-serif text-[28px] text-[#231a12] md:text-[36px]">Micro-Lot Harvests & Oven Bakes</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {['All Offerings', 'Whole Bean', 'Patisserie'].map((label, index) => (
                <button
                  key={label}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold ${index === 0 ? 'bg-[#000000] text-white' : 'bg-white text-[#4e4540]'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product) => (
              <div key={product.name} className="overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="relative aspect-square overflow-hidden bg-[#fdebde]">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-[#231a12]">
                    {product.category}
                  </span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{product.category}</div>
                    <div className="flex items-center gap-1 text-[#ba7334]">
                      <span className="material-symbols-outlined text-[16px]">star</span>
                      <span className="text-[12px] font-semibold">4.9</span>
                    </div>
                  </div>
                  <h3 className="mt-2 text-[20px] font-semibold text-[#231a12]">{product.name}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[24px] font-semibold text-[#231a12]">{product.price}</span>
                    <button className="rounded-lg bg-[#000000] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#231a12]">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
