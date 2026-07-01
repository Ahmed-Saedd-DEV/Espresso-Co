import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Star, Flame, Clock, Truck, ShieldAlert, Sparkles, Check } from 'lucide-react';
import { Product, Screen } from '../types';
import { PRODUCTS } from '../data';

interface ProductDetailViewProps {
  product: Product | null;
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  onSelectProduct: (product: Product) => void;
}

export default function ProductDetailView({
  product,
  lang,
  onNavigate,
  onAddToCart,
  onSelectProduct,
}: ProductDetailViewProps) {
  // Guard clause if no product is active
  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-mono text-gray-400">
          {lang === 'en' ? 'Select a delight to view details.' : 'يرجى اختيار منتج لعرض تفاصيله.'}
        </p>
        <button onClick={() => onNavigate('shop')} className="mt-4 px-5 py-2.5 bg-[#4a2c11] text-white rounded-full">
          {lang === 'en' ? 'Go to Menu' : 'الذهاب للمتجر'}
        </button>
      </div>
    );
  }

  // Configurations
  const availableSizes = product.sizes || ['Single Piece', 'Box of 6', 'Box of 12'];
  const [selectedSize, setSelectedSize] = useState(availableSizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'ingredients' | 'calories' | 'delivery'>('ingredients');
  const [addedSuccessfully, setAddedSuccessfully] = useState(false);

  // Compute final price based on selected size package multiplier
  const finalPrice = product.price * (
    selectedSize.includes('6') ? 5.4 : 
    selectedSize.includes('12') ? 10.2 : 
    selectedSize.toLowerCase().includes('large') ? 1.25 : 1
  );

  // Filter related products
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToBag = () => {
    onAddToCart(product, quantity, selectedSize);
    setAddedSuccessfully(true);
    setTimeout(() => setAddedSuccessfully(false), 2500);
  };

  return (
    <div className="bg-[#faf7f2] min-h-screen py-12" id="product-detail-view">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('shop')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-[#6e5843] hover:text-[#4a2c11] mb-10 group"
          id="product-back-btn"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>{lang === 'en' ? 'Back to Collection' : 'العودة للمجموعة'}</span>
        </button>

        {/* Product Details Split Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Side: Magnificent Visual Image Box */}
          <div className="lg:col-span-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square w-full rounded-3xl overflow-hidden bg-white border border-[#e4d3c2]/40 shadow-sm"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 flex gap-1.5">
                {product.tags.map((tag, idx) => (
                  <span key={idx} className="bg-[#4a2c11] text-[#faf7f2] text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider font-mono shadow-md">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-3.5 rounded-2xl border border-[#e4d3c2]/30 flex flex-col items-center justify-center text-center">
                <Flame className="h-4.5 w-4.5 text-[#df7280] mb-1" />
                <span className="text-[10px] text-gray-400 font-mono leading-none">ENERGY</span>
                <span className="text-xs font-bold text-[#4a2c11] mt-1">{product.calories} kcal</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#e4d3c2]/30 flex flex-col items-center justify-center text-center">
                <Clock className="h-4.5 w-4.5 text-[#c99a6b] mb-1" />
                <span className="text-[10px] text-gray-400 font-mono leading-none">DELIVERY</span>
                <span className="text-xs font-bold text-[#4a2c11] mt-1">{product.deliveryTime}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-[#e4d3c2]/30 flex flex-col items-center justify-center text-center">
                <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400 mb-1" />
                <span className="text-[10px] text-gray-400 font-mono leading-none font-bold">RATING</span>
                <span className="text-xs font-bold text-[#4a2c11] mt-1">{product.rating} / 5</span>
              </div>
            </div>
          </div>

          {/* Right Side: Configuration & Cart Addition Form */}
          <div className="lg:col-span-6 space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#e4d3c2]/40 shadow-sm">
            
            {/* Title & Reviews */}
            <div>
              <span className="text-xs font-bold tracking-wider text-[#c99a6b] font-mono uppercase">
                {product.category}
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#4a2c11] mt-1">
                {lang === 'en' ? product.name : product.arabicName}
              </h1>
              
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating) 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#4a2c11]">{product.rating}</span>
                <span className="text-[10px] text-gray-400">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            {/* Price section */}
            <div className="flex items-center space-x-3 py-2">
              <span className="text-3xl font-mono font-bold text-[#4a2c11]">
                ${finalPrice.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 font-mono">
                {lang === 'en' ? 'Taxes included' : 'شامل الرسوم والضرائب'}
              </span>
            </div>

            {/* Structured narrative */}
            <p className="text-xs sm:text-sm text-[#6e5843] leading-relaxed">
              {lang === 'en' ? product.description : product.arabicDescription}
            </p>

            {/* Size selection */}
            <div>
              <span className="text-xs font-mono font-bold text-[#6e5843] uppercase tracking-wider block mb-3">
                {lang === 'en' ? 'Select Configuration' : 'اختر الإعداد (الحجم)'}
              </span>
              <div className="flex flex-wrap gap-2.5">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                      selectedSize === sz
                        ? 'bg-[#4a2c11] border-[#4a2c11] text-[#faf7f2] shadow-sm'
                        : 'bg-white border-gray-200 text-[#6e5843] hover:border-[#c99a6b]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Actions row */}
            <div className="flex flex-col sm:flex-row gap-4 items-center pt-4 border-t border-gray-100">
              
              {/* Quantity Counter */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-[#faf7f2] h-12 overflow-hidden w-full sm:w-auto">
                <button
                  onClick={handleDecrement}
                  className="px-4 text-[#6e5843] hover:bg-[#f4ebe1] font-bold h-full transition-colors"
                >
                  -
                </button>
                <span className="px-4 font-mono font-bold text-[#4a2c11] text-sm w-12 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="px-4 text-[#6e5843] hover:bg-[#f4ebe1] font-bold h-full transition-colors"
                >
                  +
                </button>
              </div>

              {/* Add to Cart CTA */}
              <button
                onClick={handleAddToBag}
                disabled={addedSuccessfully}
                className={`w-full h-12 rounded-full font-bold text-sm transition-all shadow-md flex items-center justify-center space-x-2 ${
                  addedSuccessfully
                    ? 'bg-emerald-600 text-white shadow-emerald-600/15'
                    : 'bg-[#4a2c11] hover:bg-[#5c3a1a] text-[#faf7f2]'
                }`}
                id="product-add-to-cart-btn"
              >
                {addedSuccessfully ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{lang === 'en' ? 'Added Successfully!' : 'تمت الإضافة بنجاح!'}</span>
                  </>
                ) : (
                  <>
                    <span>{lang === 'en' ? 'Add to Shopping Bag' : 'أضف لحقيبة التسوق'}</span>
                    <span className="font-mono ml-1">· ${(finalPrice * quantity).toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>

            {/* Decorative detailed tabs */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex border-b border-gray-100 mb-4" id="detail-tabs-header">
                {[
                  { id: 'ingredients', label: 'Ingredients', arabicLabel: 'المكونات' },
                  { id: 'calories', label: 'Nutrition', arabicLabel: 'التغذية والسعرات' },
                  { id: 'delivery', label: 'Delivery Details', arabicLabel: 'التوصيل والشحن' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-[#c99a6b] text-[#4a2c11]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {lang === 'en' ? tab.label : tab.arabicLabel}
                  </button>
                ))}
              </div>

              {/* Tab Content Box */}
              <div className="text-xs text-[#6e5843] leading-relaxed min-h-[70px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'ingredients' && (
                    <motion.div
                      key="ingredients"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1.5"
                    >
                      <p className="font-semibold text-[#4a2c11]">{lang === 'en' ? 'Authentic Formulation:' : 'التركيبة الأصلية الفاخرة:'}</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {product.ingredients.map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  {activeTab === 'calories' && (
                    <motion.div
                      key="calories"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-1.5"
                    >
                      <p className="font-semibold text-[#4a2c11]">{lang === 'en' ? 'Nutritional Reference Value (per serving):' : 'القيم الغذائية المرجعية (لكل حصة):'}</p>
                      <div className="grid grid-cols-2 gap-2 font-mono">
                        <div className="flex justify-between border-b pb-0.5"><span>Calories:</span> <span className="font-bold">{product.calories} kcal</span></div>
                        <div className="flex justify-between border-b pb-0.5"><span>Total Fat:</span> <span className="font-bold">14g</span></div>
                        <div className="flex justify-between border-b pb-0.5"><span>Sugars:</span> <span className="font-bold">18g</span></div>
                        <div className="flex justify-between border-b pb-0.5"><span>Proteins:</span> <span className="font-bold">6g</span></div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'delivery' && (
                    <motion.div
                      key="delivery"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 text-emerald-600">
                        <Truck className="h-4 w-4" />
                        <span className="font-semibold">{lang === 'en' ? 'Direct Thermal Insulation Box' : 'تغليف حراري معزول بالكامل'}</span>
                      </div>
                      <p>
                        {lang === 'en'
                          ? 'All drinks and bakery products are shipped in insulated thermo-cool boxes to preserve correct beverage temperature and pastry fluffiness.'
                          : 'يتم شحن جميع المشروبات والمخبوزات في صناديق حرارية معزولة للحفاظ على درجة حرارة المشروبات وهشاشة المعجنات.'}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Section: Related Delights */}
        <div className="mt-20 pt-12 border-t border-[#e4d3c2]/40" id="related-products-section">
          <h2 className="font-serif text-xl font-bold text-[#4a2c11] mb-8">
            {lang === 'en' ? 'Other Gourmet Accents' : 'حلويات أخرى مكملة'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectProduct(rel);
                  setQuantity(1);
                  setSelectedSize(rel.sizes ? rel.sizes[0] : 'Single Piece');
                  // scroll to top of details
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer bg-white p-4 rounded-2xl border border-[#e4d3c2]/20 hover:border-[#c99a6b]/30 transition-all flex items-center space-x-3"
              >
                <img
                  src={rel.image}
                  alt={rel.name}
                  className="w-16 h-16 rounded-xl object-cover"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#4a2c11] group-hover:text-[#c99a6b] transition-colors line-clamp-1">
                    {lang === 'en' ? rel.name : rel.arabicName}
                  </h4>
                  <p className="text-[10px] text-gray-400 capitalize">{rel.category}</p>
                  <p className="text-xs font-mono font-bold text-[#4a2c11] mt-0.5">${rel.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
