import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, Mail, Lock, User, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Screen } from '../types';

interface AuthViewProps {
  lang: 'en' | 'ar';
  onNavigate: (screen: Screen) => void;
  onLoginSuccess: (user: { name: string; email: string; isAdmin: boolean }) => void;
}

export default function AuthView({ lang, onNavigate, onLoginSuccess }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    // Simulate database authentication
    setTimeout(() => {
      if (isLogin) {
        // Mock default login credentials or dynamic entries
        if (email.toLowerCase().includes('admin')) {
          onLoginSuccess({ name: 'Admin Manager', email: email, isAdmin: true });
        } else {
          onLoginSuccess({ name: email.split('@')[0] || 'Gourmet Member', email: email, isAdmin: false });
        }
      } else {
        // Registration success
        onLoginSuccess({ name: name || 'Sweet Creator', email: email, isAdmin: false });
      }
      setIsSubmitting(false);
      onNavigate('home');
    }, 1200);
  };

  return (
    <div className="bg-[#faf7f2] min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-8" id="auth-view-container">
      <div className="mx-auto max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 bg-white rounded-3xl overflow-hidden border border-[#e4d3c2]/40 shadow-xl">
        
        {/* Left Side: Asymmetric / Bento Style Visual Info Panel (6 Cols on Desktop) */}
        <div className="md:col-span-5 bg-[#4a2c11] p-8 text-[#faf7f2] flex flex-col justify-between relative overflow-hidden min-h-[300px] md:min-h-[550px]">
          <div className="absolute inset-0 bg-[radial-gradient(#c99a6b_1px,transparent_1px)] [background-size:20px_20px] opacity-10"></div>
          
          {/* Decorative floating shapes */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-[#c99a6b] opacity-10 filter blur-xl"></div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-[#df7280] opacity-15 filter blur-2xl"></div>

          {/* Top Logo branding */}
          <div className="relative z-10 flex items-center space-x-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#c99a6b] text-[#4a2c11] shadow-md">
              <Coffee className="h-5 w-5" />
            </div>
            <span className="font-serif text-base font-bold tracking-tight text-[#faf7f2]">
              Espresso & Co.
            </span>
          </div>

          {/* Middle brand message */}
          <div className="relative z-10 space-y-4 my-auto py-8">
            <span className="inline-flex items-center space-x-1.5 rounded-full bg-[#c99a6b]/20 px-3 py-1 text-[10px] font-bold text-[#c99a6b] border border-[#c99a6b]/20">
              <Sparkles className="h-3 w-3" />
              <span>{lang === 'en' ? 'Exclusive Coffee Club' : 'نادي القهوة الحصري'}</span>
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-black leading-tight text-[#faf7f2]">
              {isLogin 
                ? (lang === 'en' ? 'Welcome Back to Sweet Comfort' : 'مرحباً بعودتك للراحة والدفء')
                : (lang === 'en' ? 'Join the Sweetness Journey' : 'انضم إلينا في رحلة الحلويات')}
            </h2>
            <p className="text-xs text-[#e4d3c2]/80 leading-relaxed">
              {lang === 'en'
                ? 'Unlock members-only secret recipes, personalized custom donut builds, free deliveries, and reward point tiers on every single purchase.'
                : 'احصل على وصفات سرية خاصة بالأعضاء فقط، ودونات مخصصة، وتوصيل مجاني، ونقاط مكافآت مع كل عملية شراء.'}
            </p>
          </div>

          {/* Footer of panel: Mascot or interactive hint */}
          <div className="relative z-10 pt-4 border-t border-[#faf7f2]/10 flex items-center space-x-3 text-xs">
            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-base">
              🍩
            </div>
            <span className="text-[#e4d3c2]/60 font-mono">
              {lang === 'en' ? 'Artisans of Bakeries & Brews' : 'خبراء المعجنات والمشروبات'}
            </span>
          </div>

        </div>

        {/* Right Side: Responsive Form Fields (7 Cols on Desktop) */}
        <div className="md:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
          
          {/* Header selectors */}
          <div className="flex space-x-4 border-b border-gray-100 pb-4 mb-6" id="auth-tabs">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrorMsg(null);
              }}
              className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                isLogin ? 'border-[#4a2c11] text-[#4a2c11]' : 'border-transparent text-gray-400'
              }`}
              id="auth-tab-login"
            >
              {lang === 'en' ? 'Welcome Back!' : 'تسجيل الدخول'}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrorMsg(null);
              }}
              className={`pb-2 text-sm font-bold border-b-2 transition-all ${
                !isLogin ? 'border-[#4a2c11] text-[#4a2c11]' : 'border-transparent text-gray-400'
              }`}
              id="auth-tab-register"
            >
              {lang === 'en' ? 'Join the Sweetness' : 'انضم لأسرتنا'}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs" id="auth-form">
            
            {/* Name field (Only during Registration) */}
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-1"
                >
                  <label className="font-semibold text-[#6e5843] block">
                    {lang === 'en' ? 'Your Name' : 'اسمك الكامل'}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={lang === 'en' ? 'Aisha Al-Subaie' : 'عائشة السبيعي'}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c99a6b]"
                      id="auth-name-input"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-semibold text-[#6e5843] block">
                {lang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aisha@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c99a6b]"
                  id="auth-email-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="font-semibold text-[#6e5843] block">
                {lang === 'en' ? 'Secure Password' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#c99a6b]"
                  id="auth-password-input"
                />
              </div>
            </div>

            {/* Simulated Error Alert */}
            {errorMsg && <p className="text-[10px] text-[#df7280] font-mono">{errorMsg}</p>}

            {/* Login CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#4a2c11] hover:bg-[#5c3a1a] text-[#faf7f2] rounded-xl font-bold transition-all shadow-md flex items-center justify-center space-x-1.5 active:scale-95 disabled:opacity-50"
              id="auth-submit-btn"
            >
              {isSubmitting ? (
                <span>...</span>
              ) : (
                <>
                  <span>{isLogin ? (lang === 'en' ? 'Log In Securely' : 'سجل الدخول بأمان') : (lang === 'en' ? 'Register Account' : 'إنشاء الحساب الجديد')}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            {/* Social mock integrations */}
            <div className="pt-6 border-t border-gray-100 space-y-3">
              <p className="text-center text-[10px] text-gray-400 font-mono uppercase tracking-wider">
                {lang === 'en' ? 'Or Connect Instantly With' : 'أو تواصل فوراً عبر'}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({ name: 'Google Explorer', email: 'google.explorer@example.com', isAdmin: false });
                    onNavigate('home');
                  }}
                  className="flex items-center justify-center space-x-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  id="auth-google-btn"
                >
                  <span className="text-sm font-bold">G</span>
                  <span className="text-[10px] font-semibold text-gray-600">Google</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLoginSuccess({ name: 'Apple VIP', email: 'apple.vip@example.com', isAdmin: false });
                    onNavigate('home');
                  }}
                  className="flex items-center justify-center space-x-2 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  id="auth-apple-btn"
                >
                  <span className="text-sm"></span>
                  <span className="text-[10px] font-semibold text-gray-600">Apple</span>
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
