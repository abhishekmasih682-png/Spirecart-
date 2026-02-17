import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, ShoppingBag, User, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  const navItems = [
    { icon: <Home className="w-6 h-6" />, label: 'Home', path: '/' },
    { icon: <Grid className="w-6 h-6" />, label: 'Categories', path: '/settings' },
    { icon: <Heart className="w-6 h-6" />, label: 'Saved', path: '/wishlist' },
    { icon: <User className="w-6 h-6" />, label: 'Profile', path: '/profile' },
  ];

  // Hide on desktop (md and up)
  return (
    <div className="fixed bottom-4 left-0 w-full px-4 md:hidden z-40 pointer-events-none">
      <div className="bg-white/90 backdrop-blur-lg border border-white/50 rounded-3xl shadow-xl shadow-slate-200/50 flex justify-between items-center h-16 px-6 pointer-events-auto max-w-sm mx-auto">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          // Insert Cart Button in the middle
          if (index === 2) {
             return (
               <React.Fragment key="cart-fragment">
                 <div className="relative -top-6">
                    <button 
                        onClick={() => setIsCartOpen(true)}
                        className="w-14 h-14 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-violet-300 transform transition-transform active:scale-95 border-4 border-slate-50"
                    >
                        <ShoppingBag className="w-6 h-6" />
                        {cartCount > 0 && (
                            <span className="absolute top-0 right-0 bg-white text-violet-600 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-violet-600">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                    isActive ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {React.cloneElement(item.icon as React.ReactElement, {
                        fill: isActive ? 'currentColor' : 'none',
                        strokeWidth: isActive ? 2.5 : 2
                  })}
                </button>
               </React.Fragment>
             )
          }

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive ? 'text-violet-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {React.cloneElement(item.icon as React.ReactElement, {
                    fill: isActive ? 'currentColor' : 'none',
                    strokeWidth: isActive ? 2.5 : 2
              })}
            </button>
          );
        })}
      </div>
    </div>
  );
};