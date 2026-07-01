import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Truck, CheckCircle2, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { CartItem, Screen, Order } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  promoDiscount: number;
  onClearCart: () => void;
  onAddOrder: (order: Order) => void;
}

export default function CheckoutView({
  cart,
  lang,
  onNavigate,
  promoDiscount,
  onClearCart,
  onAddOrder,
}: CheckoutViewProps) {
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [instructions, setInstructions] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Apple Pay' | 'Credit Card' | 'Cash on Delivery'>('Apple Pay');
  
  // Submit order states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Compute subtotal
  const subtotal = cart.reduce((sum, item) => {
    const multiplier = 
      item.selectedSize.includes('6') ? 5.4 : 
      item.selectedSize.includes('12') ? 10.2 : 
      item.selectedSize.toLowerCase().includes('large') ? 1.25 : 1;
    return sum + (item.product.price * multiplier * item.quantity);
  }, 0);

  const shippingFee = subtotal > 25.00 || subtotal === 0 ? 0.00 : 3.50;
  const discountAmount = subtotal * promoDiscount;
  const estimatedTax = (subtotal - discountAmount) * 0.05;
  const totalAmount = subtotal - discountAmount + shippingFee + estimatedTax;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !address || !phone) {
      alert(lang === 'en' ? 'Please complete all required shipping fields!' : 'يرجى إكمال جميع الحقول المطلوبة للشحن!');
      return;
    }

    setIsSubmitting(true);

    // Simulate server side placement
    setTimeout(() => {
      const generatedId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: generatedId,
        customerName: fullName,
        customerEmail: email,
        items: cart.map((item) => {
          const mult = 
            item.selectedSize.includes('6') ? 5.4 : 
            item.selectedSize.includes('12') ? 10.2 : 
            item.selectedSize.toLowerCase().includes('large') ? 1.25 : 1;
          return {
            productName: item.product.name,
            quantity: item.quantity,
            size: item.selectedSize,
            price: item.product.price * mult,
          };
        }),
        totalAmount: totalAmount,
        status: 'Preparing',
        date: new Date().toISOString().split('T')[0],
        shippingAddress: `${address}, ${city}`,
        paymentMethod: paymentMethod,
      };

      onAddOrder(newOrder);
      setPlacedOrder(newOrder);
      setIsSubmitting(false);
      onClearCart();
    }, 1500);
  };

  // If order was placed successfully, display a gorgeous animated Order Receipt Summary
  if (placedOrder) {
    return (
      <div className="bg-[#faf7f2] min-h-[80vh] flex items-center justify-center py-16" id="checkout-receipt-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg bg-white rounded-3xl p-8 border border-[#e4d3c2]/40 shadow-xl text-center space-y-6"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mx-auto">
            <CheckCircle2 className="h-10 w-10 animate-bounce" />
          </div>

          <div>
            <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
              {lang === 'en' ? 'PAYMENT RECEIVED' : 'تم استقبال الدفع'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4a2c11] mt-3">
              {lang === 'en' ? 'Order Confirmed!' : 'تم تأكيد طلبك!'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {lang === 'en' 
                ? `Thank you, ${placedOrder.customerName}. Your order is being freshly-crafted right now.`
                : `شكراً لك، ${placedOrder.customerName}. يجري تحضير طلبك طازجاً في هذه اللحظة.`}
            </p>
          </div>

          <div className="bg-[#faf7f2] p-5 rounded-2xl border border-dashed border-[#e4d3c2]/50 text-left font-mono text-xs space-y-2.5">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Order ID:</span>
              <span className="font-bold text-[#4a2c11]">{placedOrder.id}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Delivery Address:</span>
              <span className="font-bold text-[#4a2c11] truncate max-w-[200px]">{placedOrder.shippingAddress}</span>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-400">Payment:</span>
              <span className="font-bold text-[#4a2c11]">{placedOrder.paymentMethod}</span>
            </div>
            <div className="flex justify-between font-bold text-[#4a2c11]">
              <span>Paid Total:</span>
              <span>${placedOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
            <Truck className="h-4 w-4 text-[#c99a6b] animate-pulse" />
            <span>{lang === 'en' ? 'Estimated arrival: 20-30 minutes' : 'الوصول المتوقع: خلال 20-30 دقيقة'}</span>
          </div>

          <button
            onClick={() => onNavigate('home')}
            className="w-full rounded-full bg-[#4a2c11] py-3 text-xs font-bold text-white hover:bg-[#5c3a1a] transition-all"
            id="receipt-home-btn"
          >
            {lang === 'en' ? 'Back to Sweet Home' : 'العودة للرئيسية'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#faf7f2] min-h-screen py-12" id="checkout-view-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#4a2c11] mb-10">
          {lang === 'en' ? 'Checkout Details' : 'تفاصيل الدفع والشحن'}
        </h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Shipping and Payments forms */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Shipping form card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4d3c2]/40 shadow-sm space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#4a2c11] pb-3 border-b border-gray-100">
                {lang === 'en' ? '1. Courier Shipping Address' : '1. عنوان الشحن والتوصيل'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="space-y-1.5 col-span-1">
                  <label className="font-semibold text-[#6e5843] block">{lang === 'en' ? 'Full Name *' : 'الاسم الكامل *'}</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={lang === 'en' ? 'Aisha Al-Subaie' : 'عائشة السبيعي'}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c99a6b]"
                    id="checkout-name-input"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="font-semibold text-[#6e5843] block">{lang === 'en' ? 'Email Address *' : 'البريد الإلكتروني *'}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aisha@example.com"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c99a6b]"
                    id="checkout-email-input"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-[#6e5843] block">{lang === 'en' ? 'Street/Villa Number *' : 'الشارع / رقم الفيلا أو الشقة *'}</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={lang === 'en' ? 'Al Diyafah St, Villa 42, Yas Island' : 'شارع الضيافة، فيلا 42، جزيرة ياس'}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c99a6b]"
                    id="checkout-address-input"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="font-semibold text-[#6e5843] block">{lang === 'en' ? 'City *' : 'المدينة *'}</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={lang === 'en' ? 'Abu Dhabi' : 'أبوظبي'}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c99a6b]"
                    id="checkout-city-input"
                  />
                </div>

                <div className="space-y-1.5 col-span-1">
                  <label className="font-semibold text-[#6e5843] block">{lang === 'en' ? 'Phone Number *' : 'رقم الجوال *'}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c99a6b]"
                    id="checkout-phone-input"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-[#6e5843] block">{lang === 'en' ? 'Special Instructions' : 'تعليمات خاصة بالتوصيل'}</label>
                  <textarea
                    rows={2}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder={lang === 'en' ? 'Leave on porch, ring doorbell' : 'اترك الطلب عند الباب، رن الجرس'}
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#c99a6b]"
                    id="checkout-instructions"
                  />
                </div>

              </div>
            </div>

            {/* 2. Payment Method Selector */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#e4d3c2]/40 shadow-sm space-y-5">
              <h2 className="font-serif text-lg font-bold text-[#4a2c11] pb-3 border-b border-gray-100">
                {lang === 'en' ? '2. Choose Secure Payment' : '2. اختر طريقة دفع آمنة'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Apple Pay')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all ${
                    paymentMethod === 'Apple Pay'
                      ? 'border-[#4a2c11] bg-[#4a2c11]/5 text-[#4a2c11] font-bold'
                      : 'border-gray-200 text-[#6e5843] hover:border-[#c99a6b]'
                  }`}
                >
                  <span className="text-sm font-serif mb-1"> Pay</span>
                  <span className="text-[10px] text-gray-400 font-mono">1-Click Fast Checkout</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit Card')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all ${
                    paymentMethod === 'Credit Card'
                      ? 'border-[#4a2c11] bg-[#4a2c11]/5 text-[#4a2c11] font-bold'
                      : 'border-gray-200 text-[#6e5843] hover:border-[#c99a6b]'
                  }`}
                >
                  <CreditCard className="h-5 w-5 mb-1 text-[#c99a6b]" />
                  <span className="text-[10px] text-gray-400 font-mono">Visa / Mastercard</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`flex flex-col items-center justify-center p-4 border rounded-2xl transition-all ${
                    paymentMethod === 'Cash on Delivery'
                      ? 'border-[#4a2c11] bg-[#4a2c11]/5 text-[#4a2c11] font-bold'
                      : 'border-gray-200 text-[#6e5843] hover:border-[#c99a6b]'
                  }`}
                >
                  <Truck className="h-5 w-5 mb-1 text-[#df7280]" />
                  <span className="text-[10px] text-gray-400 font-mono">Pay on Arrival</span>
                </button>

              </div>
            </div>

          </div>

          {/* Right Column: Invoice Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-5 border border-[#e4d3c2]/40 shadow-sm space-y-4">
              <h3 className="font-serif text-base font-bold text-[#4a2c11] pb-3 border-b border-gray-100">
                {lang === 'en' ? 'Basket Breakdown' : 'سلتك اللذيذة'}
              </h3>

              {/* Minified items list */}
              <div className="space-y-3.5 max-h-48 overflow-y-auto pr-1">
                {cart.map((item, index) => {
                  const multiplier = 
                    item.selectedSize.includes('6') ? 5.4 : 
                    item.selectedSize.includes('12') ? 10.2 : 
                    item.selectedSize.toLowerCase().includes('large') ? 1.25 : 1;
                  return (
                    <div key={index} className="flex justify-between text-xs text-[#6e5843]">
                      <div className="max-w-[70%]">
                        <p className="font-semibold text-[#4a2c11] truncate">
                          {lang === 'en' ? item.product.name : item.product.arabicName}
                        </p>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          Qty: {item.quantity} · Size: {item.selectedSize}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-[#4a2c11]">
                        ${(item.product.price * multiplier * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Breakdown numbers */}
              <div className="border-t border-gray-100 pt-3.5 space-y-2 text-xs font-mono text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-[#4a2c11] font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-[#df7280]">
                    <span>Discount:</span>
                    <span>-${discountAmount.toFixed(2)}</span>
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

              {/* Grand Total */}
              <div className="border-t border-gray-100 pt-3.5 flex justify-between items-center">
                <span className="text-sm font-bold text-[#4a2c11]">{lang === 'en' ? 'Final Payment:' : 'الصافي للدفع:'}</span>
                <span className="text-lg font-mono font-bold text-[#4a2c11]">${totalAmount.toFixed(2)}</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#4a2c11] hover:bg-[#5c3a1a] text-white rounded-full font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
                id="place-order-btn"
              >
                {isSubmitting ? (
                  <span>{lang === 'en' ? 'Processing Securely...' : 'جاري معالجة الدفع...'}</span>
                ) : (
                  <>
                    <span>{lang === 'en' ? 'Place Order Securely' : 'تأكيد وإرسال الطلب'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 pt-4 text-[10px] text-gray-400">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>SSL Secured Checkout Platform</span>
              </div>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
