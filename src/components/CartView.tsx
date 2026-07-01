import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Trash2, ArrowRight, Tag, ShieldCheck, Ticket } from 'lucide-react';
import { CartItem, Screen } from '../types';
import { PROMO_CODES } from '../data';

interface CartViewProps {
  cart: CartItem[];
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  promoDiscount: number;
  promoCodeApplied: string;
  onApplyPromo: (code: string, discount: number) => void;
}

export default function CartView({
  cart,
  lang,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  promoDiscount,
  promoCodeApplied,
  onApplyPromo,
}: CartViewProps) {
  const [promoInput, setPromoInput] = useState(promoCodeApplied);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccess, setPromoSuccess] = useState<string | null>(null);

  // Compute subtotal
  const subtotal = cart.reduce((sum, item) => {
    // Basic multiplier depending on size
    const multiplier = 
      item.selectedSize.includes('6') ? 5.4 : 
      item.selectedSize.includes('12') ? 10.2 : 
      item.selectedSize.toLowerCase().includes('large') ? 1.25 : 1;
    return sum + (item.product.price * multiplier * item.quantity);
  }, 0);

  // Constants
  const shippingFee = subtotal > 25.00 || subtotal === 0 ? 0.00 : 3.50;
  const discountAmount = subtotal * promoDiscount;
  const estimatedTax = (subtotal - discountAmount) * 0.05; // 5% VAT
  const totalAmount = subtotal - discountAmount + shippingFee + estimatedTax;

  const handleApplyPromo = () => {
    setPromoError(null);
    setPromoSuccess(null);

    const found = PROMO_CODES.find((p) => p.code.toUpperCase() === promoInput.trim().toUpperCase());
    if (found) {
      onApplyPromo(found.code, found.discount);
      setPromoSuccess(lang === 'en' ? `Code '${found.code}' applied successfully!` : `تم تطبيق الكود '${found.code}' بنجاح!`);
    } else {
      setPromoError(lang === 'en' ? 'Invalid promo code. Try SWEET10 or WELCOME.' : 'كود غير صحيح. جرب SWEET10 أو WELCOME.');
    }
  };

  const handleRemove = (productId: string, size: string) => {
    onRemoveItem(productId, size);
  };

  const handleIncrement = (item: CartItem) => {
    onUpdateQuantity(item.product.id, item.selectedSize, item.quantity + 1);
  };

  const handleDecrement = (item: CartItem) => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.product.id, item.selectedSize, item.quantity - 1);
    } else {
      onRemoveItem(item.product.id, item.selectedSize);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#faf7f2] min-h-[70vh] flex items-center justify-center py-16" id="cart-empty-state">
        <div className="mx-auto max-w-md text-center p-8 bg-white rounded-3xl border border-[#e4d3c2]/40 shadow-sm">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f4ebe1] text-[#4a2c11] mx-auto mb-6">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="font-serif text-xl font-bold text-[#4a2c11]">
            {lang === 'en' ? 'Your Shopping Bag is Empty' : 'حقيبة التسوق الخاصة بك فارغة'}
          </h2>
          <p className="text-xs text-[#6e5843] mt-2 mb-6 leading-relaxed">
            {lang === 'en'
              ? 'Add some freshly-brewed coffee or gourmet handmade donuts to start your delightful sweet escape.'
              : 'أضف بعض قهوتنا المختصة أو الدونات المصنوعة يدوياً لتبدأ رحلتك اللذيذة.'}
          </p>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full rounded-full bg-[#4a2c11] py-3 text-xs font-bold text-[#faf7f2] hover:bg-[#5c3a1a] transition-all"
          >
            {lang === 'en' ? 'Explore Delights' : 'استكشف اللذائذ'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen py-12" id="cart-view-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4a2c11] mb-10">
          {lang === 'en' ? 'Your Shopping Bag' : 'حقيبة التسوق الخاصة بك'}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Cart items table */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {cart.map((item) => {
                const multiplier = 
                  item.selectedSize.includes('6') ? 5.4 : 
                  item.selectedSize.includes('12') ? 10.2 : 
                  item.selectedSize.toLowerCase().includes('large') ? 1.25 : 1;
                const itemTotal = item.product.price * multiplier * item.quantity;

                return (
                  <motion.div
                    key={`${item.product.id}-${item.selectedSize}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col sm:flex-row items-center gap-4 bg-white p-5 rounded-2xl border border-[#e4d3c2]/30 shadow-sm"
                    id={`cart-item-${item.product.id}`}
                  >
                    {/* Item Image */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Info */}
                    <div className="flex-grow text-center sm:text-left">
                      <h3 className="font-serif text-sm font-bold text-[#4a2c11]">
                        {lang === 'en' ? item.product.name : item.product.arabicName}
                      </h3>
                      <p className="text-[10px] text-[#c99a6b] font-mono uppercase mt-0.5">
                        Size: {item.selectedSize}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Unit Price: ${(item.product.price * multiplier).toFixed(2)}
                      </p>
                    </div>

                    {/* Counter Controls */}
                    <div className="flex items-center border border-gray-200 rounded-lg h-9 overflow-hidden bg-[#faf7f2]">
                      <button
                        onClick={() => handleDecrement(item)}
                        className="px-3 text-gray-500 hover:bg-[#f4ebe1]"
                      >
                        -
                      </button>
                      <span className="px-3 font-mono font-bold text-xs text-[#4a2c11] w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleIncrement(item)}
                        className="px-3 text-gray-500 hover:bg-[#f4ebe1]"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <div className="text-right sm:ml-4">
                      <p className="text-xs text-gray-400 leading-none mb-1 font-mono uppercase">TOTAL</p>
                      <p className="text-sm font-mono font-bold text-[#4a2c11]">${itemTotal.toFixed(2)}</p>
                    </div>

                    {/* Delete Icon */}
                    <button
                      onClick={() => handleRemove(item.product.id, item.selectedSize)}
                      className="text-gray-300 hover:text-[#df7280] p-2 transition-colors sm:ml-4"
                      id={`cart-delete-${item.product.id}`}
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>

                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Delivery Assurance */}
            <div className="bg-[#f4ebe1]/30 border border-[#e4d3c2]/40 p-4 rounded-2xl flex items-start space-x-3 text-xs text-[#6e5843]">
              <ShieldCheck className="h-5 w-5 text-[#c99a6b] flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#4a2c11]">{lang === 'en' ? 'Freshness Insurance Guarantee' : 'ضمان طزاجة المعجنات والمخبوزات'}</p>
                <p className="mt-1 leading-relaxed">
                  {lang === 'en'
                    ? 'Our orders are fresh-proofed. If they arrive cold, soggy, or delayed, we will replace the full basket for free—no questions asked.'
                    : 'جميع طلباتنا مضمونة الطزاجة. إذا وصلت باردة أو تالفة، سنقوم باستبدال السلة كاملة مجاناً ودون أي أسئلة.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Calculations and Summary */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Promo code card */}
            <div className="bg-white rounded-2xl p-5 border border-[#e4d3c2]/40 shadow-sm">
              <span className="text-[10px] font-mono font-bold text-[#6e5843] uppercase tracking-wider block mb-3">
                {lang === 'en' ? 'Promo Code Coupon' : 'كوبون الخصم الترويجي'}
              </span>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. WELCOME"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError(null);
                      setPromoSuccess(null);
                    }}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-xs uppercase focus:outline-none focus:border-[#c99a6b]"
                    id="promo-input"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="bg-[#4a2c11] hover:bg-[#5c3a1a] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95"
                  id="promo-apply-btn"
                >
                  {lang === 'en' ? 'Apply' : 'تطبيق'}
                </button>
              </div>

              {/* Promo Validation Messages */}
              {promoError && <p className="text-[10px] text-[#df7280] font-mono mt-2">{promoError}</p>}
              {promoSuccess && <p className="text-[10px] text-emerald-600 font-mono mt-2">{promoSuccess}</p>}
            </div>

            {/* Invoice summary */}
            <div className="bg-white rounded-2xl p-5 border border-[#e4d3c2]/40 shadow-sm space-y-3.5">
              <h3 className="font-serif text-base font-bold text-[#4a2c11] pb-3 border-b border-gray-100">
                {lang === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </h3>

              <div className="space-y-2 text-xs text-[#6e5843] font-mono">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-[#4a2c11]">${subtotal.toFixed(2)}</span>
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#df7280]">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>Discount ({promoDiscount * 100}%):</span>
                    </span>
                    <span className="font-bold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>{shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (5% VAT):</span>
                  <span>${estimatedTax.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3.5 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-[#4a2c11]">{lang === 'en' ? 'Total Amount:' : 'المبلغ الإجمالي:'}</span>
                <span className="text-lg font-mono font-bold text-[#4a2c11]">${totalAmount.toFixed(2)}</span>
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full h-12 rounded-full bg-[#4a2c11] hover:bg-[#5c3a1a] text-[#faf7f2] font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-1.5 active:scale-95 mt-4"
                id="cart-checkout-btn"
              >
                <span>{lang === 'en' ? 'Proceed to Checkout' : 'الذهاب للدفع والشحن'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
