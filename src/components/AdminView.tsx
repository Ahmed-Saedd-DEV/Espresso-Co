import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, ShoppingBag, Users, Star, Plus, Check, Edit, RefreshCw, Eye, Sparkles } from 'lucide-react';
import { Order, Review, Product, Screen } from '../types';

interface AdminViewProps {
  orders: Order[];
  reviews: Review[];
  products: Product[];
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  onUpdateOrderStatus: (orderId: string, status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Delivered') => void;
  onAddNewProduct: (product: Product) => void;
}

export default function AdminView({
  orders,
  reviews,
  products,
  lang,
  onNavigate,
  onUpdateOrderStatus,
  onAddNewProduct,
}: AdminViewProps) {
  // Add product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdArabicName, setNewProdArabicName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('5.50');
  const [newProdCategory, setNewProdCategory] = useState('sweets');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdArabicDesc, setNewProdArabicDesc] = useState('');
  const [newProdCalories, setNewProdCalories] = useState('320');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800');
  const [formSaved, setFormSaved] = useState(false);

  // Financial statistics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0) + 1420.50; // seeded offset
  const totalOrdersCount = orders.length + 86;
  const customersCount = 54;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice) {
      alert('Please fill out Name and Price.');
      return;
    }

    const createdProd: Product = {
      id: `custom-prod-${Date.now()}`,
      name: newProdName,
      arabicName: newProdArabicName || newProdName,
      description: newProdDesc || 'An artisan creation crafted with care.',
      arabicDescription: newProdArabicDesc || 'ابتكار يدوي مصنوع بكل عناية.',
      price: parseFloat(newProdPrice),
      rating: 5.0,
      reviewCount: 1,
      image: newProdImage,
      category: newProdCategory,
      tags: ['New Arrival', 'Artisanal'],
      calories: parseInt(newProdCalories) || 280,
      ingredients: ['Brioche flour', 'Whole butter', 'Specialty glaze'],
      deliveryTime: '15-20 mins',
    };

    onAddNewProduct(createdProd);
    setFormSaved(true);
    
    // Reset fields
    setNewProdName('');
    setNewProdArabicName('');
    setNewProdPrice('5.50');
    setNewProdDesc('');
    setNewProdArabicDesc('');
    
    setTimeout(() => {
      setFormSaved(false);
      setShowAddForm(false);
    }, 2000);
  };

  return (
    <div className="bg-[#faf7f2] min-h-screen py-10" id="admin-view-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-[#e4d3c2]/40">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#c99a6b]">
              {lang === 'en' ? 'Administrative Overviews' : 'لوحة التحكم والعمليات'}
            </span>
            <h1 className="font-serif text-3xl font-extrabold text-[#4a2c11] mt-1">
              {lang === 'en' ? 'Boutique Headquarters' : 'إدارة المتجر العام'}
            </h1>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-full bg-[#4a2c11] hover:bg-[#5c3a1a] px-6 py-3 text-xs font-bold text-[#faf7f2] shadow-sm flex items-center space-x-1.5 active:scale-95 transition-all"
            id="admin-toggle-create-btn"
          >
            <Plus className="h-4 w-4" />
            <span>{lang === 'en' ? 'Introduce New Delight' : 'إضافة منتج جديد'}</span>
          </button>
        </div>

        {/* Dynamic New Product Creation Panel Drawer */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-white rounded-3xl p-6 sm:p-8 border border-[#e4d3c2]/40 shadow-md mb-10"
              id="admin-product-creator-panel"
            >
              <h3 className="font-serif text-lg font-bold text-[#4a2c11] mb-5 pb-2 border-b">
                {lang === 'en' ? 'New Product Definition' : 'تعريف منتج جديد'}
              </h3>
              
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                <div className="space-y-1">
                  <label className="font-semibold text-[#6e5843] block">English Name *</label>
                  <input
                    type="text"
                    required
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    placeholder="e.g. Lavender Honey Glazed"
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#6e5843] block">Arabic Name</label>
                  <input
                    type="text"
                    value={newProdArabicName}
                    onChange={(e) => setNewProdArabicName(e.target.value)}
                    placeholder="مثال: دونات مغطاة بعسل اللافندر"
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#6e5843] block">Price ($) *</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#6e5843] block">Calories (kcal)</label>
                  <input
                    type="number"
                    value={newProdCalories}
                    onChange={(e) => setNewProdCalories(e.target.value)}
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-[#c99a6b]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#6e5843] block">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-xl focus:outline-none bg-white cursor-pointer"
                  >
                    <option value="coffee">Coffee</option>
                    <option value="sweets">Sweets (Donuts)</option>
                    <option value="bakery">Bakery</option>
                    <option value="specialty">Specialty Drink</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#6e5843] block">Image URL (Unsplash)</label>
                  <input
                    type="text"
                    value={newProdImage}
                    onChange={(e) => setNewProdImage(e.target.value)}
                    className="w-full p-2.5 border rounded-xl focus:outline-none focus:border-[#c99a6b] font-mono text-[10px]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-[#6e5843] block">Description (English)</label>
                  <textarea
                    rows={2}
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Describe the flavor profiles, glazes..."
                    className="w-full p-2.5 border rounded-xl focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-[#6e5843] block">Description (Arabic)</label>
                  <textarea
                    rows={2}
                    value={newProdArabicDesc}
                    onChange={(e) => setNewProdArabicDesc(e.target.value)}
                    placeholder="صف النكهات، والطبقات العلوية..."
                    className="w-full p-2.5 border rounded-xl focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex justify-between items-center pt-4 border-t">
                  {formSaved ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                      <Check className="h-4 w-4" />
                      {lang === 'en' ? 'New Creation Saved!' : 'تم حفظ ابتكارك الجديد!'}
                    </span>
                  ) : <span />}
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow-md"
                  >
                    {lang === 'en' ? 'Add to Catalog' : 'إضافة للكتالوج'}
                  </button>
                </div>

              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Financial metrics dashboard tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12" id="admin-stats-grid">
          
          {/* Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-[#e4d3c2]/40 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">MONTHLY REVENUE</p>
              <p className="text-2xl font-mono font-bold text-[#4a2c11] mt-1">${totalRevenue.toFixed(2)}</p>
              <div className="flex items-center space-x-1 mt-1.5 text-[10px] text-emerald-600 font-bold">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+12.8% vs last week</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#faf7f2] text-[#4a2c11] flex items-center justify-center font-bold text-lg border border-[#e4d3c2]/20">
              $
            </div>
          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-3xl border border-[#e4d3c2]/40 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">TOTAL ORDERS</p>
              <p className="text-2xl font-mono font-bold text-[#4a2c11] mt-1">{totalOrdersCount}</p>
              <div className="flex items-center space-x-1 mt-1.5 text-[10px] text-[#c99a6b] font-bold">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>+8.4% this month</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#faf7f2] text-[#4a2c11] flex items-center justify-center">
              🍩
            </div>
          </div>

          {/* Members */}
          <div className="bg-white p-6 rounded-3xl border border-[#e4d3c2]/40 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-widest">SWEET CLUB MEMBERS</p>
              <p className="text-2xl font-mono font-bold text-[#4a2c11] mt-1">{customersCount}</p>
              <div className="flex items-center space-x-1 mt-1.5 text-[10px] text-[#df7280] font-bold">
                <Users className="h-3.5 w-3.5" />
                <span>+24.0% new members</span>
              </div>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-[#faf7f2] text-[#4a2c11] flex items-center justify-center">
              ✨
            </div>
          </div>

        </div>

        {/* Split grid: Orders list and Customer feedback */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Recent Orders manager */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#e4d3c2]/40 shadow-sm space-y-5">
            <h3 className="font-serif text-lg font-bold text-[#4a2c11] pb-3 border-b border-gray-100 flex items-center justify-between">
              <span>{lang === 'en' ? 'Active Orders Table' : 'جدول الطلبات النشطة'}</span>
              <span className="text-[10px] bg-[#faf7f2] border border-[#e4d3c2] px-2 py-1 rounded-md text-[#4a2c11] font-mono">
                {orders.length} ACTIVE
              </span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs" id="admin-orders-table">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 uppercase font-mono tracking-wider text-[10px]">
                    <th className="py-3 px-2">Order ID</th>
                    <th className="py-3 px-2">Customer</th>
                    <th className="py-3 px-2">Total Paid</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-[#6e5843]">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-2 font-mono font-bold text-[#4a2c11]">{order.id}</td>
                      <td className="py-3 px-2">
                        <p className="font-semibold text-gray-800">{order.customerName}</p>
                        <span className="text-[10px] text-gray-400 font-mono block truncate max-w-[120px]">{order.customerEmail}</span>
                      </td>
                      <td className="py-3 px-2 font-mono font-semibold text-[#4a2c11]">${order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-bold uppercase font-mono ${
                          order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                          order.status === 'Preparing' ? 'bg-amber-50 text-amber-600' :
                          order.status === 'Out for Delivery' ? 'bg-blue-50 text-blue-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                          className="bg-[#faf7f2] border border-gray-200 rounded-lg p-1 text-[10px] font-bold text-[#4a2c11] focus:outline-none cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Preparing">Preparing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Customer Feedback */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#e4d3c2]/40 shadow-sm space-y-4">
            <h3 className="font-serif text-base font-bold text-[#4a2c11] pb-3 border-b border-gray-100">
              {lang === 'en' ? 'Recent Customer Reviews' : 'آراء العملاء الأخيرة'}
            </h3>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-3.5 rounded-2xl bg-[#faf7f2]/50 border border-gray-100 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img src={rev.userAvatar} alt={rev.userName} className="w-7 h-7 rounded-full object-cover" />
                      <div>
                        <p className="font-bold text-gray-800 leading-none">{rev.userName}</p>
                        <span className="text-[9px] text-gray-400 font-mono mt-0.5 block">{rev.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                  </div>

                  <p className="text-[#6e5843] leading-relaxed italic">
                    "{lang === 'en' ? rev.comment : rev.arabicComment}"
                  </p>

                  <p className="text-[10px] font-mono font-bold text-[#c99a6b]">
                    {rev.productName}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
