import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { productApi } from '../api/products';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types/product';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=900&q=80';
const DEFAULT_LIMIT = 12;

function getNumberParam(searchParams: URLSearchParams, key: string, fallback: number) {
  const value = Number(searchParams.get(key) ?? fallback);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [priceCap, setPriceCap] = useState(() => {
    const nextValue = Number(searchParams.get('maxPrice') ?? 50);
    return Number.isFinite(nextValue) && nextValue >= 0 ? nextValue : 50;
  });
  const { addItem } = useCart();

  const categoryFilter = searchParams.get('category') ?? 'all';
  const page = getNumberParam(searchParams, 'page', 1);
  const querySearch = searchParams.get('search') ?? '';
  const sort = searchParams.get('sort') ?? '';
  const order = searchParams.get('order') ?? 'desc';

  useEffect(() => {
    setSearchInput(querySearch);
  }, [querySearch]);

  useEffect(() => {
    const nextValue = Number(searchParams.get('maxPrice') ?? 50);
    if (Number.isFinite(nextValue) && nextValue >= 0) {
      setPriceCap(nextValue);
    } else {
      setPriceCap(50);
    }
  }, [searchParams]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        const trimmed = searchInput.trim();

        if (trimmed) {
          next.set('search', trimmed);
        } else {
          next.delete('search');
        }

        next.delete('page');
        return next;
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);

        if (priceCap >= 50) {
          next.delete('minPrice');
          next.delete('maxPrice');
        } else {
          next.set('minPrice', '0');
          next.set('maxPrice', String(priceCap));
        }

        next.delete('page');
        return next;
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [priceCap]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await adminApi.getCategories({ page: 1, limit: 100 });
        setCategories(response.data ?? []);
      } catch {
        setCategories([]);
      }
    };

    void loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        page,
        limit: DEFAULT_LIMIT,
      };

      if (querySearch) {
        params.search = querySearch;
      }

      if (categoryFilter !== 'all') {
        params.category = categoryFilter;
      }

      const minPriceValue = searchParams.get('minPrice');
      const maxPriceValue = searchParams.get('maxPrice');

      if (minPriceValue) {
        params.minPrice = minPriceValue;
      }

      if (maxPriceValue) {
        params.maxPrice = maxPriceValue;
      }

      if (sort) {
        params.sort = sort;
      }

      if (sort && order) {
        params.order = order;
      }

      try {
        setLoading(true);
        const response = await productApi.getProducts(params);
        setProducts(response.data ?? []);
        setTotalPages(response.pagination?.totalPages ?? 1);
        setTotalRecords(response.pagination?.totalRecords ?? response.data?.length ?? 0);
      } catch {
        setProducts([]);
        setTotalPages(1);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, [page, querySearch, categoryFilter, searchParams, sort, order]);

  const availableCategories = useMemo(() => [{ name: 'all', label: 'All Products' }, ...categories.map((category) => ({ name: category.name, label: category.name }))], [categories]);

  const visibleProducts = useMemo(() => {
    if (categoryFilter === 'all') {
      return products;
    }

    return products.filter((product) => (product.category ?? 'Coffee') === categoryFilter);
  }, [categoryFilter, products]);

  const updateParams = (nextValues: Record<string, string | null | undefined>, clearPage = true) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);

      Object.entries(nextValues).forEach(([key, value]) => {
        if (!value || value === 'all') {
          next.delete(key);
          return;
        }

        next.set(key, value);
      });

      if (clearPage) {
        next.delete('page');
      }

      return next;
    });
  };

  const handleCategoryChange = (value: string) => {
    updateParams({ category: value === 'all' ? null : value });
  };

  const handleSortChange = (value: 'featured' | 'price-asc' | 'price-desc' | 'newest') => {
    if (value === 'featured') {
      updateParams({ sort: null, order: null });
      return;
    }

    if (value === 'price-asc') {
      updateParams({ sort: 'price', order: 'asc' });
      return;
    }

    if (value === 'price-desc') {
      updateParams({ sort: 'price', order: 'desc' });
      return;
    }

    updateParams({ sort: 'createdAt', order: 'desc' });
  };

  const changePage = (nextPage: number) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.set('page', String(nextPage));
      return next;
    });
  };

  const clearAllFilters = () => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      next.delete('search');
      next.delete('category');
      next.delete('sort');
      next.delete('order');
      next.delete('page');
      return next;
    });
    setSearchInput('');
  };

  const handleAddToCart = async (product: Product) => {
    await addItem({
      id: String(product.id),
      name: product.name,
      category: product.category ?? 'Coffee',
      image: product.image ?? FALLBACK_IMAGE,
      price: Number(product.price ?? 0),
    });
  };

  const sortValue = sort ? `${sort}-${order}` : 'featured';

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="bg-[#fff1e8] py-10">
        <div className="mx-auto max-w-[1360px] px-5 md:px-12">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.12em] text-[#ba7334]">
              <span className="h-2 w-2 rounded-full bg-[#ba7334] animate-pulse" />
              Autumn Harvest Roasts & Atelier Confections
            </div>
            <h1 className="font-serif text-[38px] leading-none md:text-[56px]">Shop All Offerings</h1>
            <p className="mt-4 max-w-2xl text-[18px] leading-7 text-[#4e4540]">
              Explore our freshly roasted specialty coffees, brewing gear, and artisanal desserts curated for deliberate living and sensory ritual.
            </p>
            <div className="mt-6 max-w-xl rounded-xl bg-white p-2 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[22px] text-[#4e4540]">search</span>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  placeholder="Search products, sensory notes, or patisserie..."
                  className="w-full bg-transparent text-[15px] text-[#231a12] outline-none placeholder:text-[#4e4540]/70"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-[1360px] px-5 md:px-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="rounded-xl bg-white p-6 shadow-sm lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#000000]">tune</span>
                <span className="text-[20px] font-semibold text-[#231a12]">Filters</span>
              </div>
              <button type="button" onClick={clearAllFilters} className="text-[13px] font-semibold text-[#ba7334]">
                Clear All
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between gap-2 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                  <span>Category</span>
                  {categoryFilter !== 'all' ? (
                    <button type="button" onClick={() => handleCategoryChange('all')} className="font-semibold text-[#ba7334]">
                      Clear category
                    </button>
                  ) : null}
                </div>
                <div className="space-y-2">
                  {availableCategories.map((option) => {
                    const checked = categoryFilter === option.name;

                    return (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => handleCategoryChange(option.name)}
                        className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition ${
                          checked ? 'bg-[#fff1e8] ring-1 ring-[#ba7334]' : 'hover:bg-[#fff1e8]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="category"
                            checked={checked}
                            onChange={() => handleCategoryChange(option.name)}
                            className="h-4 w-4 accent-[#000000]"
                          />
                          <span className="text-[15px] text-[#231a12]">{option.label}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="mb-3 text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Price Range</div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={priceCap}
                  onChange={(event) => setPriceCap(Number(event.target.value))}
                  className="h-2 w-full accent-[#000000]"
                />
                <div className="mt-2 flex items-center justify-between text-[12px] text-[#4e4540]">
                  <span>$0</span>
                  <span>${priceCap}</span>
                </div>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="text-[14px] text-[#4e4540]">
                {loading ? 'Loading offerings...' : `Showing ${visibleProducts.length} of ${totalRecords} curated offerings`}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {['featured', 'price-asc', 'price-desc', 'newest'].map((value) => {
                  const label = value === 'featured' ? 'Featured' : value === 'price-asc' ? 'Price: Low → High' : value === 'price-desc' ? 'Price: High → Low' : 'Newest';
                  const active = sortValue === value;

                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleSortChange(value as 'featured' | 'price-asc' | 'price-desc' | 'newest')}
                      className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                        active ? 'bg-[#000000] text-white' : 'bg-white text-[#4e4540]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {loading ? (
              <div className="rounded-[20px] border border-[#e8dfd5] bg-white p-8 text-center text-[#4e4540]">Loading products...</div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-[20px] border border-[#e8dfd5] bg-white p-10 text-center text-[#4e4540]">
                <p className="text-lg font-semibold text-[#231a12]">No offerings match your current filters.</p>
                <p className="mt-2 text-sm">Try a different keyword or reset the product filters.</p>
              </div>
            ) : (
              <>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <article key={product.id} className="overflow-hidden rounded-xl border border-[#e8dfd5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                      <div className="relative aspect-[4/4.2] overflow-hidden bg-[#fdebde]">
                        <img src={product.image ?? FALLBACK_IMAGE} alt={product.name} className="h-full w-full object-cover" />
                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#231a12]">
                          {product.category ?? 'Coffee'}
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{product.category ?? 'Coffee'}</span>
                          <span className="flex items-center gap-1 text-[#ba7334] text-[12px] font-semibold">
                            <span className="material-symbols-outlined text-[16px]">star</span>{(product.rating ?? 4.8).toFixed(1)}
                          </span>
                        </div>
                        <Link to={`/product/${product.id}`} className="mt-2 block text-[20px] font-semibold text-[#231a12] hover:text-[#ba7334]">{product.name}</Link>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-[24px] font-semibold text-[#231a12]">${Number(product.price ?? 0).toFixed(2)}</span>
                          <button type="button" onClick={() => void handleAddToCart(product)} className="rounded-lg bg-[#000000] px-4 py-2 text-[13px] font-semibold text-white">
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => changePage(Math.max(1, page - 1))}
                      disabled={page <= 1}
                      className="rounded-full border border-[#e8dfd5] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        onClick={() => changePage(pageNumber)}
                        className={`rounded-full px-3 py-2 text-sm ${
                          pageNumber === page ? 'bg-[#000000] text-white' : 'border border-[#e8dfd5] bg-white text-[#231a12]'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => changePage(Math.min(totalPages, page + 1))}
                      disabled={page >= totalPages}
                      className="rounded-full border border-[#e8dfd5] bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
