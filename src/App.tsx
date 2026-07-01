import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PRODUCTS, MOCK_ORDERS, REVIEWS } from './data';
import { Product, CartItem, Order, Review, Screen } from './types';

// Import Views
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ShopView from './components/ShopView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import AuthView from './components/AuthView';
import AdminView from './components/AdminView';

export default function App() {
  // Global States
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Default logged in user for comfortable shopping
  const [user, setUser] = useState<{ name: string; email: string; isAdmin: boolean } | null>({
    name: 'Aisha Al-Subaie',
    email: 'aisha@example.com',
    isAdmin: false,
  });

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [ordersList, setOrdersList] = useState<Order[]>(MOCK_ORDERS);
  const [reviewsList, setReviewsList] = useState<Review[]>(REVIEWS);

  // Promo Code States
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [promoCodeApplied, setPromoCodeApplied] = useState<string>('');

  // Handlers
  const handleToggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
    // Smoothly scroll window to top upon screen navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, quantity: number, size: string) => {
    setCart((prevCart) => {
      // Check if product with same size is already in cart
      const existingIdx = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIdx > -1) {
        const updated = [...prevCart];
        updated[existingIdx].quantity += quantity;
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedSize: size }];
      }
    });
  };

  const handleUpdateQuantity = (productId: string, size: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string, size: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedSize === size))
    );
  };

  const handleApplyPromo = (code: string, discount: number) => {
    setPromoCodeApplied(code);
    setPromoDiscount(discount);
  };

  const handleClearCart = () => {
    setCart([]);
    setPromoCodeApplied('');
    setPromoDiscount(0);
  };

  const handleAddOrder = (order: Order) => {
    setOrdersList((prev) => [order, ...prev]);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered'
  ) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const handleAddNewProduct = (product: Product) => {
    setProductsList((prev) => [product, ...prev]);
  };

  const handleLoginSuccess = (userProfile: { name: string; email: string; isAdmin: boolean }) => {
    setUser(userProfile);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div 
      className={`min-h-screen bg-[#faf7f2] flex flex-col font-sans selection:bg-[#c99a6b]/30 selection:text-[#4a2c11]`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      id="app-container"
    >
      
      {/* Universal Sticky Header Navigation */}
      <Navbar
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        cart={cart}
        lang={lang}
        onToggleLang={handleToggleLang}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Multi-Screen Content Wrapper */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            id={`screen-wrapper-${currentScreen}`}
          >
            {currentScreen === 'home' && (
              <HomeView
                lang={lang}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}

            {currentScreen === 'shop' && (
              <ShopView
                lang={lang}
                onNavigate={handleNavigate}
                onSelectProduct={(p) => setSelectedProduct(p)}
                onAddToCart={handleAddToCart}
              />
            )}

            {currentScreen === 'product' && (
              <ProductDetailView
                product={selectedProduct}
                lang={lang}
                onNavigate={handleNavigate}
                onAddToCart={handleAddToCart}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            )}

            {currentScreen === 'cart' && (
              <CartView
                cart={cart}
                lang={lang}
                onNavigate={handleNavigate}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                promoDiscount={promoDiscount}
                promoCodeApplied={promoCodeApplied}
                onApplyPromo={handleApplyPromo}
              />
            )}

            {currentScreen === 'checkout' && (
              <CheckoutView
                cart={cart}
                lang={lang}
                onNavigate={handleNavigate}
                promoDiscount={promoDiscount}
                onClearCart={handleClearCart}
                onAddOrder={handleAddOrder}
              />
            )}

            {currentScreen === 'auth' && (
              <AuthView
                lang={lang}
                onNavigate={handleNavigate}
                onLoginSuccess={handleLoginSuccess}
              />
            )}

            {currentScreen === 'admin' && (
              <AdminView
                orders={ordersList}
                reviews={reviewsList}
                products={productsList}
                lang={lang}
                onNavigate={handleNavigate}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onAddNewProduct={handleAddNewProduct}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Brand Footer */}
      <Footer lang={lang} />

    </div>
  );
}
