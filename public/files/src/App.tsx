import { Link, NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { BrandMark } from './components/BrandMark';
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { AuthPage } from './pages/AuthPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { HomePage } from './pages/HomePage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProductPage } from './pages/ProductPage';
import { ShopPage } from './pages/ShopPage';
import { RegisterPage } from './pages/RegisterPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { useAuth } from './contexts/AuthContext';
import { useCart } from './contexts/CartContext';
// ToastProvider moved to main.tsx so providers can be nested correctly
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AdminRoute } from './routes/AdminRoute';

const publicNavItems = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'Admin', to: '/admin' },
];

function NavUserControls() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();

  if (!user) {
    return (
      <>
        <Link to="/shop" className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[13px] font-semibold text-[#231a12]">
          Browse
        </Link>
        <Link to="/login" className="rounded-lg bg-[#000000] px-4 py-2 text-[13px] font-semibold text-white">
          Sign in
        </Link>
      </>
    );
  }

  return (
    <>
      <Link to="/account" className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[13px] font-semibold text-[#231a12]">
        Account
      </Link>
      <Link to="/orders" className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[13px] font-semibold text-[#231a12]">
        Orders
      </Link>
      <button
        type="button"
        onClick={logout}
        className="rounded-lg bg-[#000000] px-4 py-2 text-[13px] font-semibold text-white"
      >
        Logout
      </button>
      <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#fdebde] text-[#231a12]" aria-label="Cart">
        <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#000000] px-1 text-[10px] font-bold text-white">
          {itemCount}
        </span>
      </Link>
    </>
  );
}

function AppShell() {
  const { user } = useAuth();

  const navItems = user
    ? [
        { label: 'Home', to: '/' },
        { label: 'Shop', to: '/shop' },
        { label: 'Account', to: '/account' },
        { label: 'Orders', to: '/orders' },
        { label: 'Admin', to: '/admin' },
      ]
    : publicNavItems;

  return (
    <div className="min-h-screen bg-[#fff8f5] text-[#231a12]">
      <header className="border-b border-[#e8dfd5] bg-[#fff8f5]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-4 px-5 py-4 md:px-12">
          <Link to="/" className="flex items-center gap-3" aria-label="Espresso home">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                    isActive ? 'text-[#231a12]' : 'text-[#4e4540] hover:text-[#231a12]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/shop" className="rounded-lg border border-[#e8dfd5] bg-white px-3 py-2 text-[13px] font-semibold text-[#231a12]">
              Browse
            </Link>
            <NavUserControls />
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/not-found" element={<div className="mx-auto max-w-[1360px] px-5 py-24 text-center"><h1 className="font-serif text-5xl">Page not found</h1><p className="mt-4 text-[#4e4540]">The page you requested could not be found.</p><Link to="/" className="mt-6 inline-block rounded-lg bg-[#000000] px-5 py-3 text-sm font-semibold text-white">Return home</Link></div>} />
          <Route path="*" element={<Navigate to="/not-found" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
