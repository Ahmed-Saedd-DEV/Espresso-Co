import { Coffee, Instagram, Twitter, MessageCircle, Heart } from 'lucide-react';

interface FooterProps {
  lang: 'en' | 'ar';
}

export default function Footer({ lang }: FooterProps) {
  return (
    <footer className="bg-[#1f1207] text-[#f4ebe1] border-t border-[#4a2c11] pt-16 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:gap-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c99a6b] text-[#1f1207]">
                <Coffee className="h-5 w-5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#faf7f2]">
                {lang === 'en' ? 'Espresso & Co.' : 'إسبريسو وشركاه'}
              </span>
            </div>
            <p className="text-sm text-[#e4d3c2]/70 leading-relaxed">
              {lang === 'en' 
                ? 'Crafting unforgettable moments of warmth and sweetness with our artisanal, stone-ground specialty drinks and fluffy hand-glazed brioche donuts.' 
                : 'نصنع لحظات دافئة وحلوة لا تُنسى من خلال مشروباتنا المختصة المصنوعة يدوياً ودونات البريوش الهشة المحضرة يومياً بكل حب.'}
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f2]/5 text-[#c99a6b] hover:bg-[#c99a6b] hover:text-[#1f1207] transition-all">
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f2]/5 text-[#c99a6b] hover:bg-[#c99a6b] hover:text-[#1f1207] transition-all">
                <Twitter className="h-4.5 w-4.5" />
              </a>
              <a href="#" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f2]/5 text-[#c99a6b] hover:bg-[#c99a6b] hover:text-[#1f1207] transition-all">
                <MessageCircle className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Opening Hours Col */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#faf7f2] mb-4">
              {lang === 'en' ? 'Boutique Hours' : 'ساعات العمل'}
            </h3>
            <ul className="space-y-3 text-sm text-[#e4d3c2]/70">
              <li className="flex justify-between border-b border-[#faf7f2]/5 pb-1">
                <span>{lang === 'en' ? 'Saturday – Thursday' : 'السبت – الخميس'}</span>
                <span className="font-mono text-[#c99a6b]">7:00 AM - 12:00 AM</span>
              </li>
              <li className="flex justify-between border-b border-[#faf7f2]/5 pb-1">
                <span>{lang === 'en' ? 'Friday' : 'الجمعة'}</span>
                <span className="font-mono text-[#c99a6b]">1:00 PM - 1:00 AM</span>
              </li>
              <li className="flex justify-between">
                <span>{lang === 'en' ? 'Delivery Available' : 'التوصيل متاح'}</span>
                <span className="text-[#df7280] font-semibold">{lang === 'en' ? '24/7' : 'على مدار الساعة'}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links Col */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#faf7f2] mb-4">
              {lang === 'en' ? 'The Collection' : 'المجموعات'}
            </h3>
            <ul className="space-y-2.5 text-sm text-[#e4d3c2]/70">
              <li>
                <a href="#" className="hover:text-[#c99a6b] transition-colors">
                  {lang === 'en' ? 'Signature Warm Brews' : 'مشروبات دافئة مميزة'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c99a6b] transition-colors">
                  {lang === 'en' ? 'Kashmiri Saffron Specials' : 'كولد برو الزعفران الكشميري'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c99a6b] transition-colors">
                  {lang === 'en' ? 'Gourmet Hand-Dipped Donuts' : 'دونات مغطسة فاخرة'}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#c99a6b] transition-colors">
                  {lang === 'en' ? 'Flaky Butter Croissants' : 'كرواسون الزبدة الفرنسي'}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div>
            <h3 className="font-serif text-base font-semibold text-[#faf7f2] mb-4">
              {lang === 'en' ? 'Join the Sweet Club' : 'انضم لنادي الحلويات'}
            </h3>
            <p className="text-sm text-[#e4d3c2]/70 mb-4 leading-relaxed">
              {lang === 'en' 
                ? 'Subscribe to receive secret recipes, priority ordering alerts, and early access to our limited batches.' 
                : 'اشترك للحصول على الوصفات السرية، وتنبيهات الطلب ذي الأولوية، والوصول المبكر للإصدارات الخاصة المحدودة.'}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <input
                type="email"
                placeholder={lang === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                className="w-full rounded-xl bg-[#faf7f2]/5 border border-[#4a2c11] px-4 py-2.5 text-sm text-[#faf7f2] placeholder-[#e4d3c2]/40 focus:border-[#c99a6b] focus:outline-none focus:ring-1 focus:ring-[#c99a6b] transition-all"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#c99a6b] px-4 py-2.5 text-xs font-bold text-[#1f1207] hover:bg-[#d8a87a] transition-all active:scale-95"
              >
                {lang === 'en' ? 'Subscribe Now' : 'اشترك الآن'}
              </button>
            </form>
          </div>

        </div>

        <div className="mt-16 border-t border-[#faf7f2]/5 pt-8 text-center text-xs text-[#e4d3c2]/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2026 Espresso & Co. Boutique. All rights reserved.
          </p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-[#df7280] fill-[#df7280]" />
            <span>for the sweet tooth community</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
