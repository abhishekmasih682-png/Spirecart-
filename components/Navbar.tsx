import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useMenu } from '../context/MenuContext';
import { Search, ShoppingCart, User, Menu, Heart, Globe, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { APP_LOGO } from '../constants';

export const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toggleMenu } = useMenu();
  const navigate = useNavigate();

  const [language, setLanguage] = useState('English');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const languages = ['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

  const handleSearch = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <nav className="sticky top-0 z-40 glass-morphism border-b border-white/50">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-4">
          
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              onClick={toggleMenu}
              className="p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-violet-200 group-hover:scale-105 transition-transform duration-300">
                <img src={APP_LOGO} alt="Spirecart Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl sm:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-fuchsia-600 tracking-tight block">
                Spirecart
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex flex-1 max-w-xl relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-violet-500 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for 'biryani', 'crocin' or 'iphone'..."
              className="w-full bg-slate-100/80 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-violet-500 focus:bg-white transition-all shadow-inner placeholder:text-slate-400"
            />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            
            {/* Language Selector */}
            <div className="relative">
                <button 
                  onClick={() => setShowLangMenu(!showLangMenu)}
                  className="p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-600 rounded-xl flex items-center gap-1 transition-colors"
                  title="Change Language"
                >
                    <Globe className="w-5 h-5" />
                    <span className="text-xs font-bold hidden sm:block uppercase">{language.slice(0, 2)}</span>
                </button>
                {showLangMenu && (
                    <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)}></div>
                    <div className="absolute top-full right-0 mt-2 w-40 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 py-2 z-20 max-h-64 overflow-y-auto ring-1 ring-black/5">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">Select Language</div>
                        {languages.map(lang => (
                            <button 
                                key={lang}
                                onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-violet-50 hover:text-violet-600 transition-colors ${language === lang ? 'font-bold text-violet-600 bg-violet-50' : 'text-slate-700'}`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                    </>
                )}
            </div>

            {isAuthenticated ? (
               <div className="flex items-center gap-2">
                 <Link to="/profile" className="flex items-center gap-2 hover:bg-violet-50 rounded-xl px-2 py-1 transition-colors">
                   <div className="w-8 h-8 bg-gradient-to-r from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-sm border border-white shadow-sm">
                     {user?.name.charAt(0)}
                   </div>
                   <span className="text-sm font-bold text-slate-700 hidden sm:block">Hi, {user?.name.split(' ')[0]}</span>
                 </Link>
               </div>
            ) : (
               <Link to="/login" className="text-slate-500 hover:text-violet-600 font-bold text-sm sm:text-base px-2">
                 Log in
               </Link>
            )}
            
            <Link to="/wishlist" className="p-2 text-slate-600 hover:bg-violet-50 hover:text-fuchsia-500 rounded-xl transition-colors hidden sm:block">
                <Heart className="w-6 h-6" />
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-600 rounded-xl transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white transform scale-100 transition-transform shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Search - Visible only on mobile */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search everything..."
              className="w-full bg-slate-100/80 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};