import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Star, ShoppingBag, Eye, ArrowUpDown, Sparkles } from 'lucide-react';
import { Product, Screen } from '../types';
import { PRODUCTS, CATEGORIES } from '../data';

interface ShopViewProps {
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
}

export default function ShopView({
  lang,
  onNavigate,
  onSelectProduct,
  onAddToCart,
}: ShopViewProps) {
  // Filters & Sorting States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxPrice, setMaxPrice] = useState(10.00);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'rating'>('default');
  const [showFilters, setShowFilters] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute filtered & sorted products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (product.arabicName && product.arabicName.includes(searchQuery)) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default sorting
    });
  }, [searchQuery, selectedCategory, maxPrice, sortBy]);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const defaultSize = product.sizes ? product.sizes[0] : 'Regular';
    onAddToCart(product, 1, defaultSize);
    
    // Quick success toast
    setSuccessMessage(`${lang === 'en' ? 'Added' : 'تم إضافة'} ${lang === 'en' ? product.name : product.arabicName} !`);
    setTimeout(() => setSuccessMessage(null), 2500);
  };

  return (
    <div className="bg-[#faf7f2] min-h-screen py-10" id="shop-view-container">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Intro */}
        <div className="mb-10 text-center sm:text-left">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#c99a6b]">
            {lang === 'en' ? 'The Sweet Collection' : 'مجموعة الحلويات الفاخرة'}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#4a2c11] mt-1">
            {lang === 'en' ? 'Sweets, Brews & Alchemy' : 'حلويات ومشروبات مجهزة بعناية'}
          </h1>
          <p className="text-xs text-[#6e5843] mt-2 max-w-xl">
            {lang === 'en' 
              ? 'Filter and find your perfect daily escape. Every item is hand-dipped and slow-brewed to order.' 
              : 'قم بالتصفية وابحث عن هروبك اليومي المثالي. كل قطعة مغطسة يدوياً ومخمرة بعناية فائقة عند الطلب.'}
          </p>
        </div>

        {/* Global Success Toast */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#4a2c11] text-[#faf7f2] px-5 py-3 rounded-full shadow-xl flex items-center space-x-2 border border-[#c99a6b]/30"
            >
              <Sparkles className="h-4 w-4 text-[#c99a6b]" />
              <span className="text-xs font-bold">{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories Tab Row */}
        <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-thin scrollbar-thumb-[#e4d3c2] gap-2" id="shop-category-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-full text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#4a2c11] text-[#faf7f2] shadow-md shadow-[#4a2c11]/10'
                  : 'bg-white text-[#6e5843] border border-[#e4d3c2]/40 hover:bg-[#f4ebe1]'
              }`}
            >
              {lang === 'en' ? cat.name : cat.arabicName}
            </button>
          ))}
        </div>

        {/* Filters and Search Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-2xl p-4 border border-[#e4d3c2]/40 shadow-sm mb-8" id="shop-action-bar">
          
          {/* Search Box */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'en' ? 'Search cravings...' : 'ابحث عن رغبتك...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:border-[#c99a6b] focus:ring-1 focus:ring-[#c99a6b] focus:outline-none transition-all"
              id="shop-search-input"
            />
          </div>

          {/* Controls toggle and sorting dropdown */}
          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1.5 bg-[#faf7f2] border border-[#e4d3c2]/50 px-3 py-2 rounded-xl">
              <ArrowUpDown className="h-3.5 w-3.5 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-none text-xs font-semibold text-[#4a2c11] focus:outline-none cursor-pointer"
                id="shop-sort-select"
              >
                <option value="default">{lang === 'en' ? 'Default Sort' : 'الترتيب الافتراضي'}</option>
                <option value="price-asc">{lang === 'en' ? 'Price: Low to High' : 'السعر: من الأقل للأعلى'}</option>
                <option value="price-desc">{lang === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى للأقل'}</option>
                <option value="rating">{lang === 'en' ? 'Highest Rating' : 'التقييم الأعلى'}</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                showFilters
                  ? 'bg-[#4a2c11]/5 border-[#4a2c11] text-[#4a2c11]'
                  : 'bg-white border-gray-200 text-[#6e5843] hover:bg-[#f4ebe1]'
              }`}
              id="shop-filter-toggle"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>{lang === 'en' ? 'Filters' : 'تصفية'}</span>
            </button>
          </div>
        </div>

        {/* Expandable Filter Drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-[#faf7f2] border border-[#e4d3c2]/50 rounded-2xl p-6 mb-8"
              id="shop-filter-drawer"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                
                {/* Price range selector */}
                <div>
                  <label className="text-xs font-bold text-[#4a2c11] block mb-2">
                    {lang === 'en' ? `Max Price: $${maxPrice.toFixed(2)}` : `السعر الأقصى: $${maxPrice.toFixed(2)}`}
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.25"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                    className="w-full h-1 bg-[#e4d3c2] rounded-lg appearance-none cursor-pointer accent-[#4a2c11]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
                    <span>$2.00</span>
                    <span>$10.00</span>
                  </div>
                </div>

                {/* Reset filters button */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setMaxPrice(10.00);
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSortBy('default');
                    }}
                    className="w-full text-center py-2 px-4 border border-dashed border-[#df7280] text-[#df7280] hover:bg-[#df7280]/5 rounded-xl text-xs font-semibold transition-all"
                  >
                    {lang === 'en' ? 'Reset All Filters' : 'إعادة ضبط كل المصافي'}
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" id="shop-product-grid">
          <AnimatePresence>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group cursor-pointer bg-white rounded-3xl p-5 border border-[#e4d3c2]/30 shadow-sm hover:shadow-lg hover:border-[#c99a6b]/30 transition-all flex flex-col h-full relative"
                  onClick={() => {
                    onSelectProduct(product);
                    onNavigate('product');
                  }}
                  id={`product-card-${product.id}`}
                >
                  
                  {/* Image wrapper */}
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#faf7f2] mb-5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(product);
                          onNavigate('product');
                        }}
                        className="bg-white hover:bg-[#faf7f2] text-[#4a2c11] p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                        title="View Details"
                      >
                        <Eye className="h-4.5 w-4.5" />
                      </button>
                      <button
                        onClick={(e) => handleQuickAdd(e, product)}
                        className="bg-[#4a2c11] hover:bg-[#5c3a1a] text-[#faf7f2] p-3 rounded-full shadow-lg transition-transform hover:scale-110"
                        title="Quick Add to Bag"
                      >
                        <ShoppingBag className="h-4.5 w-4.5" />
                      </button>
                    </div>

                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {product.tags.slice(0, 1).map((tag, idx) => (
                        <span key={idx} className="bg-[#4a2c11] text-[#faf7f2] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Header metadata */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-serif text-base font-bold text-[#4a2c11] group-hover:text-[#c99a6b] transition-colors">
                        {lang === 'en' ? product.name : product.arabicName}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-mono tracking-wider uppercase mt-0.5">{product.category}</p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#4a2c11] bg-[#faf7f2] px-2.5 py-1 rounded-xl">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  {/* Short narrative description */}
                  <p className="text-xs text-[#6e5843]/80 leading-relaxed mb-6 flex-grow line-clamp-2">
                    {lang === 'en' ? product.description : product.arabicDescription}
                  </p>

                  {/* Bottom details row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-[#4a2c11]">{product.rating}</span>
                      <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono uppercase bg-[#f4ebe1]/30 px-2 py-1 rounded-md">
                      {product.calories} kcal
                    </span>
                  </div>

                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-sm text-gray-400 font-mono">
                  {lang === 'en' ? 'No sweet creations found matching your filters.' : 'لم نجد أي حلويات تطابق خيارات التصفية الخاصة بك.'}
                </p>
                <button
                  onClick={() => {
                    setMaxPrice(10.00);
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="mt-4 px-5 py-2.5 bg-[#4a2c11] hover:bg-[#5c3a1a] text-[#faf7f2] text-xs font-semibold rounded-full shadow-md"
                >
                  {lang === 'en' ? 'View All Delights' : 'عرض جميع المنتجات'}
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
