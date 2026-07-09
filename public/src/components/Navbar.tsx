import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, Coffee, Menu, X, User, LayoutDashboard, Globe, Sparkles } from 'lucide-react';
import { Screen, CartItem } from '../types';

interface NavbarProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  cart: CartItem[];
  lang: 'en' | 'ar';
  onToggleLang: () => void;
  user: { name: string; email: string; isAdmin: boolean } | null;
  onLogout: () => void;
}

export default function Navbar({
  currentScreen,
  onNavigate,
  cart,
  lang,
  onToggleLang,
  user,
  onLogout,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { id: 'home', label: 'Home', arabicLabel: 'الرئيسية' },
    { id: 'shop', label: 'Collection', arabicLabel: 'المجموعة' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e4d3c2]/40 bg-[#faf7f2]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo Section */}
        <div 
          onClick={() => onNavigate('home')} 
          className="flex cursor-pointer items-center space-x-3 group"
          id="nav-logo"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4a2c11] text-[#faf7f2] shadow-md shadow-[#4a2c11]/10 transition-transform group-hover:rotate-12 duration-300">
            <Coffee className="h-6 w-6" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-[#4a2c11]">
              {lang === 'en' ? 'Espresso & Co.' : 'إسبريسو وشركاه'}
            </span>
            <span className="hidden sm:block text-[10px] tracking-widest text-[#c99a6b] font-mono uppercase">
              {lang === 'en' ? 'House of Sweets' : 'بيت الحلويات الفاخرة'}
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onNavigate(link.id as Screen)}
              className={`relative py-2 text-sm font-medium transition-colors hover:text-[#4a2c11] ${
                currentScreen === link.id ? 'text-[#4a2c11] font-semibold' : 'text-[#6e5843]'
              }`}
              id={`nav-link-${link.id}`}
            >
              {lang === 'en' ? link.label : link.arabicLabel}
              {currentScreen === link.id && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute bottom-0 left-0 h-0.5 w-full bg-[#c99a6b]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}

          {/* Admin Dashboard Quick Link (Visible if Admin or for demo simulation) */}
          <button
            onClick={() => onNavigate('admin')}
            className={`flex items-center space-x-1 py-2 text-sm font-medium transition-colors hover:text-[#4a2c11] ${
              currentScreen === 'admin' ? 'text-[#4a2c11] font-semibold' : 'text-[#6e5843]'
            }`}
            id="nav-link-admin"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{lang === 'en' ? 'Dashboard' : 'لوحة التحكم'}</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          
          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-[#e4d3c2] text-[#6e5843] hover:bg-[#f4ebe1] hover:text-[#4a2c11] transition-colors"
            title={lang === 'en' ? 'Switch to Arabic' : 'تغيير للإنجليزية'}
            id="nav-lang-toggle"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-bold font-mono ml-0.5">{lang === 'en' ? 'AR' : 'EN'}</span>
          </button>

          {/* Shopping Bag Icon with elegant bubble animation */}
          <button
            onClick={() => onNavigate('cart')}
            className={`relative flex items-center justify-center h-11 w-11 rounded-full border transition-colors ${
              currentScreen === 'cart' 
                ? 'bg-[#4a2c11] border-[#4a2c11] text-[#faf7f2]' 
                : 'border-[#e4d3c2] text-[#6e5843] hover:bg-[#f4ebe1]'
            }`}
            id="nav-cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {totalCartItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#df7280] text-[10px] font-bold text-white ring-2 ring-[#faf7f2]"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* User Profile Info */}
          <div className="hidden sm:flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#c99a6b]/20 text-[#4a2c11] border border-[#c99a6b]/30 cursor-pointer"
                  onClick={() => onNavigate('admin')}
                  title="Go to dashboard"
                >
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-[#4a2c11] max-w-[100px] truncate">{user.name}</p>
                  <button 
                    onClick={onLogout} 
                    className="text-[10px] text-[#df7280] hover:underline font-mono"
                    id="nav-logout-btn"
                  >
                    {lang === 'en' ? 'Logout' : 'خروج'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('auth')}
                className="flex items-center space-x-2 rounded-full bg-[#4a2c11] px-5 py-2.5 text-xs font-semibold text-[#faf7f2] shadow-sm hover:bg-[#5c3a1a] transition-all"
                id="nav-login-btn"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{lang === 'en' ? 'Join Us' : 'انضم إلينا'}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center h-10 w-10 rounded-full border border-[#e4d3c2] text-[#6e5843] md:hidden hover:bg-[#f4ebe1]"
            id="nav-mobile-toggle"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[#e4d3c2]/40 bg-[#faf7f2]"
          >
            <div className="space-y-2 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id as Screen);
                    setIsOpen(false);
                  }}
                  className={`block w-full py-2.5 px-4 rounded-xl text-left text-sm font-medium transition-colors ${
                    currentScreen === link.id 
                      ? 'bg-[#4a2c11]/5 text-[#4a2c11] font-semibold' 
                      : 'text-[#6e5843] hover:bg-[#f4ebe1]'
                  }`}
                >
                  {lang === 'en' ? link.label : link.arabicLabel}
                </button>
              ))}
              
              <button
                onClick={() => {
                  onNavigate('admin');
                  setIsOpen(false);
                }}
                className={`flex w-full items-center space-x-2 py-2.5 px-4 rounded-xl text-left text-sm font-medium transition-colors ${
                  currentScreen === 'admin' 
                    ? 'bg-[#4a2c11]/5 text-[#4a2c11] font-semibold' 
                    : 'text-[#6e5843] hover:bg-[#f4ebe1]'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>{lang === 'en' ? 'Dashboard / Orders' : 'لوحة التحكم والطلبات'}</span>
              </button>

              <hr className="border-[#e4d3c2]/40 my-2" />

              {user ? (
                <div className="p-4 rounded-xl bg-[#f4ebe1]/40 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#4a2c11]">{user.name}</p>
                    <p className="text-xs text-[#6e5843]">{user.email}</p>
                  </div>
                  <button 
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }} 
                    className="text-xs text-[#df7280] font-bold"
                  >
                    {lang === 'en' ? 'Logout' : 'خروج'}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('auth');
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-[#4a2c11] py-3 text-sm font-semibold text-[#faf7f2] shadow-sm hover:bg-[#5c3a1a]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{lang === 'en' ? 'Join Us / Sign In' : 'انضم إلينا / تسجيل الدخول'}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
