import { useEffect, useMemo, useState } from 'react';
import { adminApi, type AdminCategory, type AdminUser, type AdminReview } from '../api/admin';
import { useToast } from '../components/ui/Toast';
import type { Order, OrderStatus } from '../types/order';
import type { Product } from '../types/product';
import { normalizeErrorMessage } from '../utils/validation';

const tabs = ['Catalog', 'Categories', 'Orders', 'Customers', 'Reviews', 'Fulfillment'];

type ProductRow = Product & {
  categoryId?: number | null;
  category?: { id?: number; name?: string } | string | null;
  images?: Array<{ id?: number; url?: string }>;
};

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  imageFile: File | null;
}

interface CategoryFormState {
  name: string;
}

function getStatusTone(status: string) {
  const toneMap: Record<string, string> = {
    PENDING: 'bg-[#fff1e8] text-[#ba7334]',
    PROCESSING: 'bg-[#fdebde] text-[#231a12]',
    SHIPPED: 'bg-[#eef3ef] text-[#4a6b53]',
    DELIVERED: 'bg-[#eef3ef] text-[#4a6b53]',
    CANCELLED: 'bg-[#f5e6e6] text-[#8d3d3d]',
  };

  return toneMap[status] ?? 'bg-[#fff1e8] text-[#4e4540]';
}

function formatMoney(value: number | string | undefined) {
  const numericValue = Number(value ?? 0);
  return `$${numericValue.toFixed(2)}`;
}

function downloadCsv(filename: string, rows: Array<Record<string, string | number>>) {
  if (!rows || rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const escapeValue = (val: string | number | undefined | null) => {
    const raw = val == null ? '' : String(val);
    if (/[",\n]/.test(raw)) {
      return `"${raw.replace(/"/g, '""')}"`;
    }
    return raw;
  };

  const csvLines = [headers.join(',')];
  for (const row of rows) {
    const line = headers.map((k) => escapeValue(row[k])).join(',');
    csvLines.push(line);
  }

  const csv = csvLines.join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const validOrderTransitions: Record<string, OrderStatus | null> = {
  PENDING: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
  DELIVERED: null,
  CANCELLED: null,
};

function emptyProductForm(): ProductFormState {
  return {
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageFile: null,
  };
}

function normalizeFieldErrorPath(path: string) {
  return path
    .replace(/^body\./, '')
    .replace(/^params\./, '')
    .replace(/^query\./, '')
    .replace(/\.$/, '');
}

function extractApiErrors(error: unknown): Record<string, string> {
  const anyError = error as {
    message?: string;
    payload?: {
      message?: string;
      errors?: Array<{ field?: string; message?: string }> | Record<string, string[]>;
    };
  };

  const payload = anyError?.payload ?? (anyError as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })?.response?.data;

  if (!payload) {
    return { form: anyError?.message ?? 'Request failed.' };
  }

  if (Array.isArray(payload.errors)) {
    return payload.errors.reduce<Record<string, string>>((acc, issue) => {
      if (!issue?.field) {
        return acc;
      }

      const field = normalizeFieldErrorPath(issue.field);
      acc[field || 'form'] = issue.message ?? 'Validation failed.';
      return acc;
    }, {});
  }

  if (payload.errors && typeof payload.errors === 'object') {
    return Object.entries(payload.errors).reduce<Record<string, string>>((acc, [field, messages]) => {
      const normalizedField = normalizeFieldErrorPath(field);
      acc[normalizedField || 'form'] = Array.isArray(messages) ? messages[0] : String(messages);
      return acc;
    }, {});
  }

  return { form: payload.message ?? anyError?.message ?? 'Request failed.' };
}

function getReadableAdminError(error: unknown): string {
  const anyError = error as {
    message?: string;
    payload?: { message?: string; errors?: unknown };
    response?: { data?: { message?: string; errors?: unknown } };
  };

  const payload = anyError?.payload ?? anyError?.response?.data;
  const rawMessage = payload?.message ?? anyError?.message ?? 'Request failed.';

  return normalizeErrorMessage(rawMessage, payload ?? error);
}

export function AdminPage() {
  const { push } = useToast();
  const [activeTab, setActiveTab] = useState<string>('Catalog');
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [selectedReviewIds, setSelectedReviewIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOrderIds, setPendingOrderIds] = useState<Set<string | number>>(new Set());
  const [pendingUserIds, setPendingUserIds] = useState<Set<string | number>>(new Set());
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | number | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(emptyProductForm());
  const [productFormErrors, setProductFormErrors] = useState<Record<string, string>>({});
  const [isProductSubmitting, setIsProductSubmitting] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>({});
  const [categorySubmitting, setCategorySubmitting] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | number | null>(null);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productResponse, categoryResponse, orderResponse, userResponse, reviewResponse] = await Promise.all([
        adminApi.getProducts({ page: 1, limit: 25 }),
        adminApi.getCategories({ page: 1, limit: 100 }),
        adminApi.getOrders({ page: 1, limit: 25 }),
        adminApi.getUsers({ page: 1, limit: 50 }),
        adminApi.getReviews({ page: 1, limit: 25 }),
      ]);

      setProducts((productResponse.data ?? []) as ProductRow[]);
      setCategories(categoryResponse.data ?? []);
      setOrders(orderResponse.data ?? []);
      setUsers(userResponse.data ?? []);
      setReviews(reviewResponse.data ?? []);
    } catch (fetchError) {
      const message = getReadableAdminError(fetchError);
      setError(message);
      push({ title: 'Admin data unavailable', description: message, tone: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAdminData();
  }, []);

  const metrics = useMemo(() => {
    const lowStockCount = products.filter((product) => Number(product.stock ?? 0) < 10).length;
    const unverifiedUsers = users.filter((user) => !user.isVerified).length;

    return [
      { label: 'Catalog inventory', value: String(products.length), delta: `${lowStockCount} low stock` },
      { label: 'Active taxonomy', value: String(products.length ? 'Live' : '0'), delta: 'Synced from API' },
      { label: 'Registered accounts', value: String(users.length), delta: `${unverifiedUsers} pending verification` },
      { label: 'Open orders', value: String(orders.filter((order) => order.status !== 'DELIVERED' && order.status !== 'CANCELLED').length), delta: 'Needs attention' },
    ];
  }, [orders, products, users]);

  const handleStatusUpdate = async (id: string | number, nextStatus: OrderStatus) => {
    if (pendingOrderIds.has(id)) {
      return;
    }

    setPendingOrderIds((current) => new Set(current).add(id));

    try {
      await adminApi.updateOrderStatus(id, nextStatus);
      const refreshed = await adminApi.getOrders({ page: 1, limit: 25 });
      setOrders(refreshed.data ?? []);
    } catch (updateError) {
      const message = getReadableAdminError(updateError);
      setError(message);
      push({ title: 'Order update failed', description: message, tone: 'danger' });
    } finally {
      setPendingOrderIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const handleCancelOrder = async (id: string | number) => {
    if (pendingOrderIds.has(id)) {
      return;
    }

    if (!window.confirm('Cancel this order? This action updates stock and marks the order cancelled.')) {
      return;
    }

    setPendingOrderIds((current) => new Set(current).add(id));

    try {
      await adminApi.cancelOrder(id);
      const refreshed = await adminApi.getOrders({ page: 1, limit: 25 });
      setOrders(refreshed.data ?? []);
    } catch (cancelError) {
      const message = getReadableAdminError(cancelError);
      setError(message);
      push({ title: 'Cancellation failed', description: message, tone: 'danger' });
    } finally {
      setPendingOrderIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
    }
  };

  const openProductForm = (product?: ProductRow) => {
    if (product) {
      const categoryObject = (product.category ?? null) as { id?: number; name?: string } | null;
      const categoryRef = categoryObject && typeof categoryObject === 'object' ? categoryObject.id ?? product.categoryId ?? '' : product.categoryId ?? '';
      setProductForm({
        name: product.name ?? '',
        description: product.description ?? '',
        price: typeof product.price === 'number' ? String(product.price) : String(product.price ?? ''),
        stock: String(product.stock ?? 0),
        categoryId: categoryRef ? String(categoryRef) : '',
        imageFile: null,
      });
      setEditingProductId(product.id);
    } else {
      setProductForm(emptyProductForm());
      setEditingProductId(null);
    }

    setProductFormErrors({});
    setShowProductForm(true);
  };

  const closeProductForm = () => {
    setShowProductForm(false);
    setEditingProductId(null);
    setProductForm(emptyProductForm());
    setProductFormErrors({});
  };

  const validateProductForm = (values: ProductFormState) => {
    const nextErrors: Record<string, string> = {};
    const trimmedName = values.name.trim();
    const trimmedDescription = values.description.trim();
    const price = Number(values.price);
    const stock = Number(values.stock);

    if (!trimmedName) {
      nextErrors.name = 'Product name is required.';
    }

    if (!trimmedDescription) {
      nextErrors.description = 'Product description is required.';
    }

    if (!values.price || Number.isNaN(price) || price <= 0) {
      nextErrors.price = 'Price must be a valid positive number.';
    }

    if (values.stock === '' || Number.isNaN(stock) || !Number.isInteger(stock) || stock < 0) {
      nextErrors.stock = 'Stock must be a non-negative integer.';
    }

    if (values.categoryId && Number(values.categoryId) <= 0) {
      nextErrors.categoryId = 'Please select a valid category.';
    }

    return nextErrors;
  };

  const handleProductSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateProductForm(productForm);
    setProductFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsProductSubmitting(true);

    try {
      const payload = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: Number(productForm.price),
        stock: Number(productForm.stock),
        categoryId: productForm.categoryId ? Number(productForm.categoryId) : null,
      };

      let productId = editingProductId;

      if (editingProductId) {
        await adminApi.updateProduct(editingProductId, payload);
      } else {
        const createdProduct = await adminApi.createProduct(payload);
        productId = createdProduct.id;
      }

      if (productForm.imageFile && productId) {
        await adminApi.addProductImage(productId, productForm.imageFile);
      }

      closeProductForm();
      await loadAdminData();
    } catch (submitError) {
      const errors = extractApiErrors(submitError);
      const message = getReadableAdminError(submitError);
      setProductFormErrors(errors);
      setError(message);
      push({ title: 'Product save failed', description: message, tone: 'danger' });
    } finally {
      setIsProductSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string | number) => {
    if (!window.confirm('Delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteProduct(id);
      await loadAdminData();
    } catch (deleteError) {
      const errors = extractApiErrors(deleteError);
      const message = getReadableAdminError(deleteError);
      setError(message);
      push({ title: 'Product delete failed', description: message, tone: 'danger' });
    }
  };

  const handleDeleteProductImage = async (productId: string | number, imageId: number | string) => {
    if (!window.confirm('Remove this product image?')) {
      return;
    }

    try {
      await adminApi.deleteProductImage(productId, imageId);
      await loadAdminData();
    } catch (deleteError) {
      const errors = extractApiErrors(deleteError);
      const message = getReadableAdminError(deleteError);
      setError(message);
      push({ title: 'Image removal failed', description: message, tone: 'danger' });
    }
  };

  const toggleReviewSelection = (id: number) => {
    setSelectedReviewIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDeleteReview = async (id: number) => {
    if (!window.confirm('Delete this review? This action cannot be undone.')) return;

    try {
      await adminApi.deleteReview(id);
      await loadAdminData();
      push({ title: 'Review deleted', description: 'Review removed successfully.', tone: 'success' });
    } catch (err) {
      const message = getReadableAdminError(err);
      push({ title: 'Delete failed', description: message, tone: 'danger' });
    }
  };

  const handleBulkDeleteReviews = async () => {
    if (selectedReviewIds.size === 0) {
      push({ title: 'No selection', description: 'Select at least one review to delete.', tone: 'info' });
      return;
    }

    if (!window.confirm(`Delete ${selectedReviewIds.size} selected review(s)? This action cannot be undone.`)) return;

    try {
      const resp = await adminApi.bulkDeleteReviews([...selectedReviewIds]);
      setSelectedReviewIds(new Set());
      await loadAdminData();
      push({ title: 'Deleted reviews', description: resp?.message ?? 'Deleted selected reviews.', tone: 'success' });
    } catch (err) {
      const message = getReadableAdminError(err);
      push({ title: 'Bulk delete failed', description: message, tone: 'danger' });
    }
  };

  const handleCategorySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      setCategoryErrors({ name: 'Category name is required.' });
      return;
    }

    setCategorySubmitting(true);
    setCategoryErrors({});

    try {
      if (editingCategoryId) {
        await adminApi.updateCategory(editingCategoryId, { name: trimmedName });
      } else {
        await adminApi.createCategory({ name: trimmedName });
      }

      setCategoryName('');
      setEditingCategoryId(null);
      await loadAdminData();
    } catch (submitError) {
      const errors = extractApiErrors(submitError);
      const message = getReadableAdminError(submitError);
      setCategoryErrors(errors);
      setError(message);
      push({ title: 'Category save failed', description: message, tone: 'danger' });
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string | number) => {
    if (!window.confirm('Delete this category?')) {
      return;
    }

    try {
      await adminApi.deleteCategory(id);
      await loadAdminData();
    } catch (deleteError) {
      const errors = extractApiErrors(deleteError);
      const message = getReadableAdminError(deleteError);
      setError(message);
      push({ title: 'Category delete failed', description: message, tone: 'danger' });
    }
  };

  const handleUserRoleChange = async (user: AdminUser, nextRole: 'USER' | 'ADMIN') => {
    if (user.role === nextRole) {
      return;
    }

    if (!window.confirm(`Change ${user.name}'s role to ${nextRole}?`)) {
      return;
    }

    setPendingUserIds((current) => new Set(current).add(user.id));

    try {
      await adminApi.updateUser(user.id, { role: nextRole });
      await loadAdminData();
    } catch (updateError) {
      const errors = extractApiErrors(updateError);
      const message = getReadableAdminError(updateError);
      setError(message);
      push({ title: 'Role update failed', description: message, tone: 'danger' });
    } finally {
      setPendingUserIds((current) => {
        const next = new Set(current);
        next.delete(user.id);
        return next;
      });
    }
  };

  const handleUserVerificationToggle = async (user: AdminUser) => {
    const nextVerified = !user.isVerified;

    if (!window.confirm(`Mark ${user.name} as ${nextVerified ? 'verified' : 'unverified'}?`)) {
      return;
    }

    setPendingUserIds((current) => new Set(current).add(user.id));

    try {
      await adminApi.updateUser(user.id, { isVerified: nextVerified });
      await loadAdminData();
    } catch (updateError) {
      const errors = extractApiErrors(updateError);
      const message = getReadableAdminError(updateError);
      setError(message);
      push({ title: 'Verification update failed', description: message, tone: 'danger' });
    } finally {
      setPendingUserIds((current) => {
        const next = new Set(current);
        next.delete(user.id);
        return next;
      });
    }
  };

  const handleExportReport = () => {
    try {
      if (activeTab === 'Catalog') {
        if (!products || products.length === 0) {
          push({ title: 'Nothing to export', description: 'There is no data in the current tab to export.', tone: 'info' });
          return;
        }

        const rows = products.map((product) => {
          const categoryObject = (product.category ?? null) as { id?: number; name?: string } | null;
          const categoryName = categoryObject && typeof categoryObject === 'object' ? categoryObject.name ?? 'Uncategorized' : typeof product.category === 'string' ? product.category : 'Uncategorized';
          return {
            id: product.id,
            name: product.name ?? '',
            category: categoryName,
            price: typeof product.price === 'number' ? product.price : Number(product.price ?? 0),
            stock: Number(product.stock ?? 0),
            status: Number(product.stock ?? 0) < 10 ? 'Low stock' : 'Healthy',
          } as Record<string, string | number>;
        });

        downloadCsv('products-report.csv', rows);
        return;
      }

      if (activeTab === 'Categories') {
        if (!categories || categories.length === 0) {
          push({ title: 'Nothing to export', description: 'There is no data in the current tab to export.', tone: 'info' });
          return;
        }

        const rows = categories.map((c) => ({ id: c.id, name: c.name }));
        downloadCsv('categories-report.csv', rows);
        return;
      }

      if (activeTab === 'Orders') {
        if (!orders || orders.length === 0) {
          push({ title: 'Nothing to export', description: 'There is no data in the current tab to export.', tone: 'info' });
          return;
        }

        const rows = orders.map((order) => ({
          id: order.id,
          customer: order.customerName ?? order.email ?? 'Unknown customer',
          total: formatMoney(order.total),
          status: order.status,
          createdAt: new Date(order.createdAt).toLocaleDateString(),
        }));

        downloadCsv('orders-report.csv', rows as Array<Record<string, string | number>>);
        return;
      }

      if (activeTab === 'Customers') {
        if (!users || users.length === 0) {
          push({ title: 'Nothing to export', description: 'There is no data in the current tab to export.', tone: 'info' });
          return;
        }

        const rows = users.map((u) => ({ id: u.id, name: u.name, email: u.email, role: u.role, verified: u.isVerified ? 'Yes' : 'No' }));
        downloadCsv('customers-report.csv', rows as Array<Record<string, string | number>>);
        return;
      }

      if (activeTab === 'Reviews') {
        if (!reviews || reviews.length === 0) {
          push({ title: 'Nothing to export', description: 'There is no data in the current tab to export.', tone: 'info' });
          return;
        }

        const rows = reviews.map((r) => ({ id: r.id, product: r.product?.name ?? '', customer: r.user?.name ?? r.user?.email ?? 'Unknown', rating: r.rating, comment: r.comment ?? '', createdAt: new Date(r.createdAt).toLocaleDateString() }));
        downloadCsv('reviews-report.csv', rows as Array<Record<string, string | number>>);
        return;
      }

      if (activeTab === 'Fulfillment') {
        if (!orders || orders.length === 0) {
          push({ title: 'Nothing to export', description: 'There is no data in the current tab to export.', tone: 'info' });
          return;
        }

        const rows = orders.map((order) => ({ id: order.id, status: order.status, createdAt: new Date(order.createdAt).toLocaleDateString() }));
        downloadCsv('fulfillment-report.csv', rows as Array<Record<string, string | number>>);
        return;
      }
    } catch (err) {
      push({ title: 'Export failed', description: 'Could not generate CSV.', tone: 'danger' });
    }
  };

  return (
    <main className="bg-[#fff8f5] pb-20 pt-8 text-[#231a12]">
      <section className="mx-auto max-w-[1360px] px-5 md:px-12">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.14em] text-[#ba7334]">Workspace Console</div>
            <h1 className="mt-2 font-serif text-[40px] text-[#231a12] leading-none">Catalog & operations workspace</h1>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => handleExportReport()} className="rounded-lg border border-[#e8dfd5] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#231a12] shadow-sm">
              Export report
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-xl border border-[#f0d7d7] bg-[#fff3f3] px-4 py-3 text-sm text-[#8d3d3d]">
            {error}
          </div>
        ) : null}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-[22px] border border-[#e8dfd5] bg-white p-5 shadow-sm">
              <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{metric.label}</div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-[30px] font-semibold leading-none text-[#231a12]">{metric.value}</span>
                <span className="text-[11px] uppercase tracking-[0.12em] text-[#4a6b53]">{metric.delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-[28px] border border-[#e8dfd5] bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                    activeTab === tab ? 'bg-[#000000] text-white' : 'bg-[#fff1e8] text-[#4e4540] hover:bg-[#fdebde]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="rounded-[20px] border border-[#e8dfd5] bg-[#fff8f5] p-8 text-center text-[#4e4540]">Loading admin data...</div>
          ) : (
            <>
              {activeTab === 'Catalog' ? (
                <div className="space-y-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => openProductForm()}
                      className="rounded-lg bg-[#000000] px-4 py-2.5 text-[13px] font-semibold text-white"
                    >
                      Add Product
                    </button>
                  </div>

                  {showProductForm ? (
                    <form onSubmit={handleProductSubmit} className="rounded-[24px] border border-[#e8dfd5] bg-[#fff8f5] p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-[#231a12]">{editingProductId ? 'Edit Product' : 'Add Product'}</h3>
                        <button type="button" onClick={closeProductForm} className="text-sm text-[#4e4540]">Close</button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Name</label>
                          <input
                            value={productForm.name}
                            onChange={(event) => setProductForm((current) => ({ ...current, name: event.target.value }))}
                            className="w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                            placeholder="Espresso blend"
                          />
                          {productFormErrors.name ? <div className="mt-1 text-xs text-[#8d3d3d]">{productFormErrors.name}</div> : null}
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Description</label>
                          <textarea
                            value={productForm.description}
                            onChange={(event) => setProductForm((current) => ({ ...current, description: event.target.value }))}
                            className="h-24 w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                            placeholder="Roasted and balanced coffee profile"
                          />
                          {productFormErrors.description ? <div className="mt-1 text-xs text-[#8d3d3d]">{productFormErrors.description}</div> : null}
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Price</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={productForm.price}
                            onChange={(event) => setProductForm((current) => ({ ...current, price: event.target.value }))}
                            className="w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                          />
                          {productFormErrors.price ? <div className="mt-1 text-xs text-[#8d3d3d]">{productFormErrors.price}</div> : null}
                        </div>

                        <div>
                          <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Stock</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={productForm.stock}
                            onChange={(event) => setProductForm((current) => ({ ...current, stock: event.target.value }))}
                            className="w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                          />
                          {productFormErrors.stock ? <div className="mt-1 text-xs text-[#8d3d3d]">{productFormErrors.stock}</div> : null}
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Category</label>
                          <select
                            value={productForm.categoryId}
                            onChange={(event) => setProductForm((current) => ({ ...current, categoryId: event.target.value }))}
                            className="w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                          >
                            <option value="">Uncategorized</option>
                            {categories.map((category) => (
                              <option key={category.id} value={String(category.id)}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                          {productFormErrors.categoryId ? <div className="mt-1 text-xs text-[#8d3d3d]">{productFormErrors.categoryId}</div> : null}
                        </div>

                        <div className="md:col-span-2">
                          <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Image</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => setProductForm((current) => ({ ...current, imageFile: event.target.files?.[0] ?? null }))}
                            className="w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                          />
                        </div>
                      </div>

                      <div className="mt-5 flex justify-end gap-3">
                        <button type="button" onClick={closeProductForm} className="rounded-lg border border-[#e8dfd5] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#231a12]">
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isProductSubmitting}
                          className="rounded-lg bg-[#000000] px-4 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isProductSubmitting ? (editingProductId ? 'Saving...' : 'Creating...') : editingProductId ? 'Save changes' : 'Create product'}
                        </button>
                      </div>
                    </form>
                  ) : null}

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="border-b border-[#e8dfd5] text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                          <th className="pb-3 pr-6">Item</th>
                          <th className="pb-3 pr-6">Category</th>
                          <th className="pb-3 pr-6">Base price</th>
                          <th className="pb-3 pr-6">Current stock</th>
                          <th className="pb-3 pr-6">Status</th>
                          <th className="pb-3 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-6 text-center text-[#4e4540]">No products returned by the API.</td>
                          </tr>
                        ) : (
                          products.map((product) => (
                            <tr key={product.id} className="border-b border-[#f1e7df] align-middle">
                              <td className="py-4 pr-6">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#fdebde] text-[#ba7334] shadow-inner">
                                    {product.images && product.images.length > 0 ? (
                                      <img src={product.images[0].url} alt={product.name} className="h-full w-full rounded-lg object-cover" />
                                    ) : (
                                      <span className="material-symbols-outlined text-[22px]">coffee</span>
                                    )}
                                  </div>
                                  <div>
                                    <div className="font-semibold text-[#231a12]">{product.name}</div>
                                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">#{product.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-6 text-[13px] text-[#231a12]">{(() => {
                                const categoryObject = (product.category ?? null) as { id?: number; name?: string } | null;
                                if (categoryObject && typeof categoryObject === 'object') {
                                  return categoryObject.name ?? 'Uncategorized';
                                }
                                return typeof product.category === 'string' ? product.category : 'Uncategorized';
                              })()}</td>
                              <td className="py-4 pr-6 text-[13px] font-medium text-[#231a12]">{formatMoney(product.price)}</td>
                              <td className="py-4 pr-6 text-[13px] text-[#4e4540]">{Number(product.stock ?? 0)} in stock</td>
                              <td className="py-4 pr-6">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${Number(product.stock ?? 0) < 10 ? 'bg-[#faf2ea] text-[#c27a3a]' : 'bg-[#eef3ef] text-[#4a6b53]'}`}>
                                  {Number(product.stock ?? 0) < 10 ? 'Low stock' : 'Healthy'}
                                </span>
                              </td>
                              <td className="py-4 pr-0 text-right">
                                <div className="flex flex-col items-end gap-2">
                                  <div className="flex gap-2">
                                    <button type="button" onClick={() => openProductForm(product)} className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[12px] font-semibold text-[#231a12]">
                                      Edit
                                    </button>
                                    <button type="button" onClick={() => void handleDeleteProduct(product.id)} className="rounded-lg bg-[#000000] px-3 py-2 text-[12px] font-semibold text-white">
                                      Delete
                                    </button>
                                  </div>
                                  {product.images && product.images.length > 0 ? (
                                    <div className="flex flex-wrap justify-end gap-2">
                                      {product.images.map((image) => (
                                        <button
                                          key={image.id ?? image.url}
                                          type="button"
                                          onClick={() => image.id !== undefined && void handleDeleteProductImage(product.id, image.id)}
                                          className="rounded-full border border-[#e8dfd5] bg-[#fff6f2] px-2 py-1 text-[10px] uppercase tracking-[0.12em] text-[#4e4540]"
                                        >
                                          Remove image
                                        </button>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeTab === 'Categories' ? (
                <div className="space-y-5">
                  <form onSubmit={handleCategorySubmit} className="rounded-[24px] border border-[#e8dfd5] bg-[#fff8f5] p-5">
                    <div className="flex flex-col gap-3 md:flex-row md:items-end">
                      <div className="flex-1">
                        <label className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Category name</label>
                        <input
                          value={categoryName}
                          onChange={(event) => setCategoryName(event.target.value)}
                          className="w-full rounded-lg border border-[#e8dfd5] bg-white px-3 py-2.5 text-sm text-[#231a12]"
                          placeholder="Single Origin"
                        />
                        {categoryErrors.name ? <div className="mt-1 text-xs text-[#8d3d3d]">{categoryErrors.name}</div> : null}
                      </div>

                      <button
                        type="submit"
                        disabled={categorySubmitting}
                        className="rounded-lg bg-[#000000] px-4 py-2.5 text-[13px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {categorySubmitting ? 'Saving...' : editingCategoryId ? 'Save category' : 'Add category'}
                      </button>

                      {editingCategoryId ? (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategoryId(null);
                            setCategoryName('');
                            setCategoryErrors({});
                          }}
                          className="rounded-lg border border-[#e8dfd5] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#231a12]"
                        >
                          Cancel
                        </button>
                      ) : null}
                    </div>
                  </form>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="border-b border-[#e8dfd5] text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                          <th className="pb-3 pr-6">Name</th>
                          <th className="pb-3 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.length === 0 ? (
                          <tr>
                            <td colSpan={2} className="py-6 text-center text-[#4e4540]">No categories available.</td>
                          </tr>
                        ) : (
                          categories.map((category) => (
                            <tr key={category.id} className="border-b border-[#f1e7df] align-middle">
                              <td className="py-4 pr-6 font-semibold text-[#231a12]">{category.name}</td>
                              <td className="py-4 pr-6 text-right">
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingCategoryId(category.id);
                                      setCategoryName(category.name);
                                      setCategoryErrors({});
                                    }}
                                    className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[12px] font-semibold text-[#231a12]"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => void handleDeleteCategory(category.id)}
                                    className="rounded-lg bg-[#000000] px-3 py-2 text-[12px] font-semibold text-white"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeTab === 'Orders' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-[#e8dfd5] text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                        <th className="pb-3 pr-6">Order</th>
                        <th className="pb-3 pr-6">Customer</th>
                        <th className="pb-3 pr-6">Total</th>
                        <th className="pb-3 pr-6">Status</th>
                        <th className="pb-3 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-[#4e4540]">No orders returned by the API.</td>
                        </tr>
                      ) : (
                        orders.map((order) => {
                          const nextStatus = validOrderTransitions[order.status];
                          const isPending = pendingOrderIds.has(order.id);

                          return (
                            <tr key={order.id} className="border-b border-[#f1e7df] align-middle">
                              <td className="py-4 pr-6">
                                <div className="font-semibold text-[#231a12]">#{order.id}</div>
                                <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">{new Date(order.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td className="py-4 pr-6 text-[13px] text-[#231a12]">{order.customerName ?? order.email ?? 'Unknown customer'}</td>
                              <td className="py-4 pr-6 text-[13px] font-medium text-[#231a12]">{formatMoney(order.total)}</td>
                              <td className="py-4 pr-6">
                                <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${getStatusTone(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-4 pr-0 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {nextStatus ? (
                                    <button
                                      type="button"
                                      onClick={() => void handleStatusUpdate(order.id, nextStatus)}
                                      disabled={isPending}
                                      className={`rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[12px] font-semibold text-[#231a12] ${isPending ? 'cursor-not-allowed opacity-60' : ''}`}
                                    >
                                      {isPending ? 'Updating...' : 'Advance'}
                                    </button>
                                  ) : null}

                                  <button
                                    type="button"
                                    onClick={() => void handleCancelOrder(order.id)}
                                    disabled={isPending}
                                    className={`rounded-lg bg-[#000000] px-3 py-2 text-[12px] font-semibold text-white ${isPending ? 'cursor-not-allowed opacity-60' : ''}`}
                                  >
                                    {isPending ? 'Updating...' : 'Cancel'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Customers' ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b border-[#e8dfd5] text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                        <th className="pb-3 pr-6">Customer</th>
                        <th className="pb-3 pr-6">Email</th>
                        <th className="pb-3 pr-6">Role</th>
                        <th className="pb-3 pr-6">Verified</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-[#4e4540]">No customer records returned by the API.</td>
                        </tr>
                      ) : (
                        users.map((user) => (
                          <tr key={user.id} className="border-b border-[#f1e7df] align-middle">
                            <td className="py-4 pr-6 font-semibold text-[#231a12]">{user.name}</td>
                            <td className="py-4 pr-6 text-[13px] text-[#231a12]">{user.email}</td>
                            <td className="py-4 pr-6 text-[13px] text-[#231a12]">
                              <select
                                value={user.role}
                                disabled={pendingUserIds.has(user.id)}
                                onChange={(event) => void handleUserRoleChange(user, event.target.value as 'USER' | 'ADMIN')}
                                className="rounded-lg border border-[#e8dfd5] bg-white px-2.5 py-2 text-[12px] font-medium text-[#231a12]"
                              >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                              </select>
                            </td>
                            <td className="py-4 pr-6">
                              <button
                                type="button"
                                onClick={() => void handleUserVerificationToggle(user)}
                                disabled={pendingUserIds.has(user.id)}
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] ${user.isVerified ? 'bg-[#eef3ef] text-[#4a6b53]' : 'bg-[#faf2ea] text-[#c27a3a]'}`}
                              >
                                {user.isVerified ? 'Verified' : 'Needs verify'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Reviews' ? (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="text-[13px] font-semibold">Reviews</div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => handleBulkDeleteReviews()} disabled={selectedReviewIds.size === 0} className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[12px] font-semibold text-[#231a12] disabled:cursor-not-allowed disabled:opacity-50">Delete selected ({selectedReviewIds.size})</button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left">
                      <thead>
                        <tr className="border-b border-[#e8dfd5] text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">
                          <th className="pb-3 pr-6"><input type="checkbox" onChange={(e) => { if (e.target.checked) { setSelectedReviewIds(new Set(reviews.map(r => r.id))); } else { setSelectedReviewIds(new Set()); } }} checked={reviews.length > 0 && selectedReviewIds.size === reviews.length} /></th>
                          <th className="pb-3 pr-6">Product</th>
                          <th className="pb-3 pr-6">Customer</th>
                          <th className="pb-3 pr-6">Rating</th>
                          <th className="pb-3 pr-6">Comment</th>
                          <th className="pb-3 pr-6">Date</th>
                          <th className="pb-3 pr-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reviews.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center text-[#4e4540]">No reviews returned by the API.</td>
                          </tr>
                        ) : (
                          reviews.map((review) => (
                            <tr key={review.id} className="border-b border-[#f1e7df] align-middle">
                              <td className="py-4 pr-6"><input type="checkbox" checked={selectedReviewIds.has(review.id)} onChange={() => toggleReviewSelection(review.id)} /></td>
                              <td className="py-4 pr-6 font-semibold text-[#231a12]">{review.product?.name ?? 'Unknown'}</td>
                              <td className="py-4 pr-6 text-[13px] text-[#231a12]">{review.user?.name ?? review.user?.email ?? 'Unknown'}</td>
                              <td className="py-4 pr-6 text-[13px] text-[#231a12]">{review.rating}/5</td>
                              <td className="py-4 pr-6 text-[13px] text-[#4e4540]">{review.comment && review.comment.length > 80 ? review.comment.slice(0, 80) + '...' : review.comment ?? '—'}</td>
                              <td className="py-4 pr-6 text-[13px] text-[#4e4540]">{new Date(review.createdAt).toLocaleDateString()}</td>
                              <td className="py-4 pr-0 text-right">
                                <div className="flex justify-end gap-2">
                                  <button type="button" onClick={() => void handleDeleteReview(review.id)} className="rounded-lg bg-[#000000] px-3 py-2 text-[12px] font-semibold text-white">Delete</button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}

              {activeTab === 'Fulfillment' ? (
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="rounded-[20px] bg-[#fff8f5] p-4">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Shipped</div>
                    <div className="mt-2 text-[28px] font-semibold text-[#231a12]">{orders.filter((order) => order.status === 'SHIPPED').length}</div>
                  </div>
                  <div className="rounded-[20px] bg-[#fff8f5] p-4">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Delivered</div>
                    <div className="mt-2 text-[28px] font-semibold text-[#231a12]">{orders.filter((order) => order.status === 'DELIVERED').length}</div>
                  </div>
                  <div className="rounded-[20px] bg-[#fff8f5] p-4">
                    <div className="text-[11px] uppercase tracking-[0.12em] text-[#4e4540]">Cancelled</div>
                    <div className="mt-2 text-[28px] font-semibold text-[#231a12]">{orders.filter((order) => order.status === 'CANCELLED').length}</div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
