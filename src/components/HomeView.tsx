import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Star, Heart, Flame, ShieldCheck, Clock, Award } from 'lucide-react';
import { Product, Screen } from '../types';
import { PRODUCTS } from '../data';

interface HomeViewProps {
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  onSelectProduct: (product: Product) => void;
}

export default function HomeView({ lang, onNavigate, onSelectProduct }: HomeViewProps) {
  // Filter popular products for display
  const popularProducts = PRODUCTS.filter((p) => p.isPopular);

  // Interactive Donut Customizer States
  const [donutGlaze, setDonutGlaze] = useState<'chocolate' | 'strawberry' | 'matcha' | 'pistachio'>('chocolate');
  const [donutTopping, setDonutTopping] = useState<'gold' | 'pistachios' | 'sprinkles' | 'none'>('sprinkles');
  const [donutDrizzle, setDonutDrizzle] = useState<'white' | 'caramel' | 'none'>('white');
  const [isDesigning, setIsDesigning] = useState(false);
  const [designSaved, setDesignSaved] = useState(false);

  const glazes = {
    chocolate: { name: 'Belgian Dark Chocolate', color: '#2a1a0e', price: 4.50 },
    strawberry: { name: 'Strawberry Rose Infusion', color: '#df7280', price: 4.25 },
    matcha: { name: 'Uji Matcha Glaze', color: '#688e4e', price: 4.75 },
    pistachio: { name: 'Iranian Pistachio Cream', color: '#97a97c', price: 5.00 },
  };

  const toppings = {
    gold: { name: '24K Gold Flakes', color: '#ffd700', price: 1.50 },
    pistachios: { name: 'Crushed Premium Pistachios', color: '#cbd5e1', price: 0.75 },
    sprinkles: { name: 'Rainbow Sugarcrystals', color: '#38bdf8', price: 0.50 },
    none: { name: 'No Topping', color: 'transparent', price: 0 },
  };

  const drizzles = {
    white: { name: 'Velvety White Chocolate Drizzle', color: '#fcfaf2', price: 0.50 },
    caramel: { name: 'Artisan Salted Caramel', color: '#d97706', price: 0.60 },
    none: { name: 'No Drizzle', color: 'transparent', price: 0 },
  };

  const designTotalPrice = 4.00 + glazes[donutGlaze].price + toppings[donutTopping].price + drizzles[donutDrizzle].price;

  return (
    <div className="bg-[#faf7f2] overflow-x-hidden" id="home-view-container">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(#c99a6b_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 rounded-full bg-[#c99a6b]/10 px-4 py-1.5 text-xs font-semibold text-[#4a2c11] border border-[#c99a6b]/20"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#c99a6b]" />
              <span>{lang === 'en' ? 'Freshly Handcrafted Every Single Hour' : 'محضرة يدوياً بكل حب كل ساعة'}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#4a2c11] leading-[1.15]"
            >
              {lang === 'en' ? (
                <>
                  Where Every <span className="text-[#c99a6b] italic font-normal">Sip</span> Tells a Story, and Every <span className="text-[#df7280]">Bite</span> Feels Like a Dream.
                </>
              ) : (
                <>
                  حيث تروي كل <span className="text-[#c99a6b] italic font-normal">رشفة</span> قصة، ويشبه كل <span className="text-[#df7280]">قضم</span> حلماً دافئاً.
                </>
              )}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-[#6e5843] max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              {lang === 'en'
                ? 'Indulge in our exquisite collection of double-shot specialty lattes infused with real saffron threads, paired perfectly with our cloud-soft, 24-hour slow-fermented brioche donuts.'
                : 'دلل حواسك بمجموعتنا الفريدة من اللاتيه المختص الغني بالزعفران الكشميري الطبيعي، المقترن تماماً مع دونات البريوش الهشة المخمرة ببطء لمدّة 24 ساعة.'}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4"
            >
              <button
                onClick={() => onNavigate('shop')}
                className="rounded-full bg-[#4a2c11] px-8 py-4 text-sm font-bold text-[#faf7f2] shadow-lg shadow-[#4a2c11]/10 hover:bg-[#5c3a1a] transition-all hover:-translate-y-0.5 flex items-center justify-center space-x-2 group"
                id="hero-explore-btn"
              >
                <span>{lang === 'en' ? 'Explore Delights' : 'استكشف اللذائذ'}</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('donut-designer-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-full border-2 border-[#e4d3c2] bg-[#faf7f2]/40 px-8 py-4 text-sm font-bold text-[#4a2c11] hover:bg-[#f4ebe1] transition-all"
                id="hero-customize-btn"
              >
                {lang === 'en' ? 'Design Your Donut' : 'صمم دونات أحلامك'}
              </button>
            </motion.div>
          </div>

          {/* Interactive Bento Visual */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-md aspect-square rounded-3xl bg-[#f4ebe1] p-6 shadow-inner border border-[#e4d3c2]/40"
            >
              <img
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=800"
                alt="Signature Coffee and Sweets"
                className="w-full h-full object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-700 pointer-events-none"
                referrerPolicy="no-referrer"
              />

              {/* Floating Badge: Bestseller */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 border border-[#f4ebe1]"
              >
                <Star className="h-4.5 w-4.5 text-amber-400 fill-amber-400" />
                <div>
                  <p className="text-[10px] font-mono text-gray-400 leading-none">FAVORITE</p>
                  <p className="text-xs font-bold text-[#4a2c11]">{lang === 'en' ? 'Chocolate Glazed' : 'شوكولاتة مميزة'}</p>
                </div>
              </motion.div>

              {/* Floating Badge: Freshly Brewed */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-[#4a2c11] px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 text-[#faf7f2]"
              >
                <Flame className="h-5 w-5 text-[#df7280]" />
                <div>
                  <p className="text-[10px] text-[#e4d3c2] leading-none">OVEN FRESH</p>
                  <p className="text-xs font-bold">{lang === 'en' ? '24h Proofed Dough' : 'مخمرة 24 ساعة'}</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. Best Sellers Carousel/Grid */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <span className="text-xs font-bold tracking-widest text-[#c99a6b] uppercase font-mono">
                {lang === 'en' ? 'Bestselling Delights' : 'ألذ مبيعاتنا'}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#4a2c11] mt-1">
                {lang === 'en' ? 'Loved by Coffee Enthusiasts' : 'محبوبة من عشاق القهوة الفاخرة'}
              </h2>
            </div>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-4 md:mt-0 flex items-center space-x-1.5 text-sm font-bold text-[#4a2c11] hover:text-[#c99a6b] transition-colors"
            >
              <span>{lang === 'en' ? 'View Full Menu' : 'عرض القائمة الكاملة'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularProducts.slice(0, 3).map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer bg-[#faf7f2]/40 rounded-3xl p-5 border border-[#e4d3c2]/30 shadow-sm hover:shadow-lg hover:border-[#c99a6b]/30 transition-all flex flex-col h-full"
                onClick={() => {
                  onSelectProduct(product);
                  onNavigate('product');
                }}
                id={`bestseller-card-${product.id}`}
              >
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#faf7f2] mb-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {product.tags.map((tag, idx) => (
                      <span key={idx} className="bg-[#4a2c11] text-[#faf7f2] text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#4a2c11] group-hover:text-[#c99a6b] transition-colors">
                      {lang === 'en' ? product.name : product.arabicName}
                    </h3>
                    <p className="text-xs text-[#6e5843] capitalize">{product.category}</p>
                  </div>
                  <span className="font-mono text-base font-bold text-[#4a2c11] bg-[#f4ebe1] px-2.5 py-1 rounded-xl">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                <p className="text-xs text-[#6e5843]/80 leading-relaxed mb-6 flex-grow line-clamp-2">
                  {lang === 'en' ? product.description : product.arabicDescription}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-[#e4d3c2]/20">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-[#4a2c11]">{product.rating}</span>
                    <span className="text-[10px] text-gray-400">({product.reviewCount} reviews)</span>
                  </div>
                  <span className="text-xs font-bold text-[#4a2c11] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>{lang === 'en' ? 'Order' : 'طلب'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 3. Interactive Donut Designer Section */}
      <section className="py-20 bg-[#f4ebe1]/60 border-y border-[#e4d3c2]/40 relative" id="donut-designer-section">
        <div className="absolute inset-0 bg-[radial-gradient(#c99a6b_1px,transparent_1px)] [background-size:32px_32px] opacity-5"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-[#df7280] uppercase font-mono">
              {lang === 'en' ? 'Interactive Playground' : 'صندوق المتعة والمرح'}
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#4a2c11] mt-1">
              {lang === 'en' ? 'Artisan Donut Lab' : 'مختبر الدونات الابتكاري'}
            </h2>
            <p className="text-sm text-[#6e5843] mt-2">
              {lang === 'en' 
                ? 'Become a master sugar-smith. Design your custom batch, watch it render live, and add it instantly to your order.' 
                : 'كن خبيراً في صناعة السكر والحلويات. صمّم قطعتك الفنية الخاصة، وشاهد النتيجة مباشرةً، ثم أضفها فوراً لطلبك.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Interactive 2D Vector Canvas Render */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center">
              <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-white shadow-xl flex items-center justify-center border border-[#e4d3c2]/40 overflow-hidden group">
                
                {/* 1. Base Brioche Ring */}
                <div className="absolute w-56 h-56 rounded-full bg-[#eab308] opacity-25 filter blur-md"></div>
                <div className="absolute w-52 h-52 rounded-full bg-[#d97706]/70 shadow-inner border-[16px] border-[#eab308]"></div>

                {/* 2. Glaze Layer (Animated changes) */}
                <motion.div
                  key={donutGlaze}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="absolute w-48 h-48 rounded-full shadow-lg border-[32px]"
                  style={{ borderColor: glazes[donutGlaze].color }}
                ></motion.div>

                {/* 3. Drizzle Layer */}
                <AnimatePresence>
                  {donutDrizzle !== 'none' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute w-44 h-44 rounded-full border-4 border-dashed"
                      style={{ borderColor: drizzles[donutDrizzle].color }}
                    ></motion.div>
                  )}
                </AnimatePresence>

                {/* 4. Topping Layer */}
                <AnimatePresence>
                  {donutTopping !== 'none' && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.85 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute w-42 h-42 flex flex-wrap items-center justify-center gap-1.5 p-4 rounded-full"
                    >
                      {[...Array(16)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full shadow-sm"
                          style={{
                            backgroundColor: toppings[donutTopping].color,
                            transform: `rotate(${i * 22.5}deg) translate(${i % 2 === 0 ? '4px' : '-2px'})`,
                          }}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Donut Hole cutout (Transparent inner center) */}
                <div className="absolute w-16 h-16 rounded-full bg-white shadow-inner border border-[#e4d3c2]/40 flex items-center justify-center font-serif text-[9px] text-gray-300 font-bold uppercase tracking-widest">
                  ESPRESSO
                </div>
              </div>

              {/* Saved Success Animation */}
              <AnimatePresence>
                {designSaved && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-xs font-bold text-emerald-600 mt-4 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-full flex items-center gap-2"
                  >
                    <span>✓</span>
                    <span>{lang === 'en' ? 'Masterpiece Added to Your Bag!' : 'تمت إضافة تحفتك الفنية بنجاح لحقيبة التسوق!'}</span>
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Control Panel */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border border-[#e4d3c2]/40 shadow-sm">
              <h3 className="font-serif text-xl font-bold text-[#4a2c11] mb-6 pb-4 border-b border-[#e4d3c2]/20">
                {lang === 'en' ? 'Designer Configurations' : 'إعدادات التصميم'}
              </h3>

              {/* Glaze choice */}
              <div className="mb-6">
                <span className="text-xs font-mono font-bold text-[#6e5843] uppercase tracking-wider block mb-3">
                  1. {lang === 'en' ? 'Base Glaze' : 'الطبقة الأساسية (التغطية)'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(glazes).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setDonutGlaze(key as any);
                        setDesignSaved(false);
                      }}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        donutGlaze === key 
                          ? 'border-[#4a2c11] bg-[#4a2c11]/5 font-semibold text-[#4a2c11]' 
                          : 'border-gray-200 hover:border-[#c99a6b] text-gray-600'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: item.color }}></div>
                      <span className="text-xs">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topping choice */}
              <div className="mb-6">
                <span className="text-xs font-mono font-bold text-[#6e5843] uppercase tracking-wider block mb-3">
                  2. {lang === 'en' ? 'Gourmet Topping' : 'المكونات العلوية الفاخرة'}
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(toppings).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setDonutTopping(key as any);
                        setDesignSaved(false);
                      }}
                      className={`flex items-center space-x-2.5 p-2.5 rounded-xl border text-left transition-all ${
                        donutTopping === key 
                          ? 'border-[#4a2c11] bg-[#4a2c11]/5 font-semibold text-[#4a2c11]' 
                          : 'border-gray-200 hover:border-[#c99a6b] text-gray-600'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full border border-black/10 shadow-sm flex items-center justify-center text-[10px]" style={{ backgroundColor: item.color }}>
                        {key === 'gold' && '✨'}
                      </div>
                      <span className="text-xs">{item.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Drizzle choice */}
              <div className="mb-8">
                <span className="text-xs font-mono font-bold text-[#6e5843] uppercase tracking-wider block mb-3">
                  3. {lang === 'en' ? 'Artistic Drizzle' : 'خطوط الزينة الرقيقة'}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(drizzles).map(([key, item]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setDonutDrizzle(key as any);
                        setDesignSaved(false);
                      }}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                        donutDrizzle === key 
                          ? 'border-[#4a2c11] bg-[#4a2c11]/5 font-semibold text-[#4a2c11]' 
                          : 'border-gray-200 hover:border-[#c99a6b] text-gray-500'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full border border-black/10 mb-1" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[10px]">{item.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customizer checkout CTA */}
              <div className="flex items-center justify-between pt-6 border-t border-[#e4d3c2]/30">
                <div>
                  <p className="text-[10px] text-gray-400 font-mono leading-none">TOTAL SUM</p>
                  <p className="text-xl font-mono font-bold text-[#4a2c11]">${designTotalPrice.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => {
                    setIsDesigning(true);
                    setDesignSaved(true);
                    setTimeout(() => setIsDesigning(false), 1500);
                  }}
                  disabled={isDesigning}
                  className="rounded-full bg-[#df7280] hover:bg-[#d65e6d] px-6 py-3 text-xs font-bold text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                  id="designer-add-to-cart"
                >
                  {isDesigning ? (
                    <span className="flex items-center gap-1">
                      <span>...</span>
                      <span>{lang === 'en' ? 'Crafting...' : 'جاري التحضير...'}</span>
                    </span>
                  ) : (
                    <span>{lang === 'en' ? 'Add Custom Donut' : 'أضف دوناتك المخصصة'}</span>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 4. Brand Philosophy & Ingredients */}
      <section className="py-24 bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a2c11]/5 text-[#4a2c11] mb-5">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#4a2c11]">
                {lang === 'en' ? '24H Yeast Fermentation' : 'تخمير بطيء لمدة 24 ساعة'}
              </h3>
              <p className="text-xs text-[#6e5843] mt-2 leading-relaxed">
                {lang === 'en' 
                  ? 'Our signature brioche dough proofs slowly overnight, absorbing healthy moisture to produce that incredibly soft, featherlight crunch.' 
                  : 'تتخمر عجينة البريوش الخاصة بنا ببطء طوال الليل، لتمتص الرطوبة الصحية وتنتج تلك الهشاشة الرائعة الخفيفة كالريشة.'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a2c11]/5 text-[#4a2c11] mb-5">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#4a2c11]">
                {lang === 'en' ? 'Single-Origin Coffee' : 'قهوة مختصة أحادية المصدر'}
              </h3>
              <p className="text-xs text-[#6e5843] mt-2 leading-relaxed">
                {lang === 'en' 
                  ? 'We source single-origin Ethiopia and Colombia beans directly from fair-trade cooperatives, micro-roasted in small batches weekly.' 
                  : 'نستورد حبوب البن الفاخرة أحادية المصدر من إثيوبيا وكولومبيا مباشرةً من مزارعي التجارة العادلة، ونحمصها أسبوعياً بدقة.'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4a2c11]/5 text-[#4a2c11] mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#4a2c11]">
                {lang === 'en' ? 'Organic Pure Toppings' : 'مكونات نقية وعضوية'}
              </h3>
              <p className="text-xs text-[#6e5843] mt-2 leading-relaxed">
                {lang === 'en' 
                  ? 'Absolutely zero artificial flavorings, preservatives, or high-fructose corn syrup. Sweetened naturally using blossom honey and organic sugarcane.' 
                  : 'خالٍ تماماً من المنكهات الاصطناعية أو المواد الحافظة أو شراب الذرة عالي الفركتوز. محلى طبيعياً بعسل الزهور وقصب السكر العضوي.'}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
