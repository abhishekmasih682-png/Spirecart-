import React from 'react';
import { useMenu } from '../context/MenuContext';
import { useAuth } from '../context/AuthContext';
import { X, User, ChevronRight, ShoppingBag, Utensils, Zap, Activity, Smartphone, Settings, HelpCircle, LogOut, Shirt, Package, MapPin } from 'lucide-react';
import { CATEGORIES } from '../constants';
import { Link, useNavigate } from 'react-router-dom';

export const MenuDrawer: React.FC = () => {
  const { isMenuOpen, setIsMenuOpen } = useMenu();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isMenuOpen) return null;

  const menuItems = [
    { label: 'Fashion Store', icon: <Shirt className="w-5 h-5 text-pink-600" />, sub: ['Men', 'Women', 'Kids', 'Beauty'] },
    { label: 'Order Food', icon: <Utensils className="w-5 h-5 text-red-500" />, sub: ['Pizza', 'Biryani', 'Burger', 'Healthy'] },
    { label: 'Grocery', icon: <Zap className="w-5 h-5 text-yellow-500" />, sub: ['Vegetables', 'Fruits', 'Dairy', 'Snacks'] },
    { label: 'Pharmacy', icon: <Activity className="w-5 h-5 text-teal-500" />, sub: ['Medicines', 'Lab Tests', 'Ayurveda'] },
    { label: 'Electronics', icon: <Smartphone className="w-5 h-5 text-blue-500" />, sub: ['Mobiles', 'Laptops', 'Audio', 'Accessories'] },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsMenuOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-3/4 max-w-xs bg-white h-full shadow-2xl flex flex-col animate-slideInLeft">
        
        {/* Header */}
        <div 
          onClick={() => isAuthenticated ? handleNavigation('/profile') : handleNavigation('/login')}
          className="bg-slate-900 text-white p-6 pt-10 relative overflow-hidden cursor-pointer hover:bg-slate-800 transition-colors"
        >
          <button 
             onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
             className="absolute top-4 right-4 p-1 text-white/70 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
              {isAuthenticated ? user?.name.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
            </div>
            <div>
              {isAuthenticated ? (
                <>
                  <h3 className="font-bold text-lg">{user?.name}</h3>
                  <p className="text-xs text-slate-300">{user?.phone} • View Profile</p>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">Welcome Guest</h3>
                  <p className="text-xs text-slate-300">Login to manage orders</p>
                </>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 mt-3" />
          </div>
          <div className="absolute -right-6 -bottom-10 w-32 h-32 bg-red-500/20 rounded-full blur-2xl"></div>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto bg-slate-50 py-2">
           
           {/* Account Section */}
           {isAuthenticated && (
             <div className="px-4 py-3 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">My Account</h4>
                <button onClick={() => handleNavigation('/orders')} className="w-full flex items-center gap-3 p-3 bg-white border border-slate-100 shadow-sm rounded-lg text-slate-700 hover:text-red-500">
                   <Package className="w-5 h-5 text-red-500" /> 
                   <span className="font-bold">Your Orders</span>
                </button>
                <button onClick={() => handleNavigation('/profile')} className="w-full flex items-center gap-3 p-3 mt-2 bg-white border border-slate-100 shadow-sm rounded-lg text-slate-700 hover:text-red-500">
                   <MapPin className="w-5 h-5 text-red-500" /> 
                   <span className="font-bold">Address Book</span>
                </button>
             </div>
           )}

           <div className="px-4 py-3">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Shop by Category</h4>
             <div className="space-y-3">
               {menuItems.map((item, idx) => (
                 <div key={idx} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                       <div className="p-2 bg-slate-50 rounded-lg">{item.icon}</div>
                       <span className="font-bold text-slate-800">{item.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 pl-12">
                      {item.sub.map((sub, sIdx) => (
                        <span key={sIdx} className="text-xs text-slate-500 hover:text-red-500 cursor-pointer">{sub}</span>
                      ))}
                    </div>
                 </div>
               ))}
             </div>
           </div>

           <div className="px-4 py-3 border-t border-slate-200">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Settings & More</h4>
             <div className="space-y-1">
               <button onClick={() => handleNavigation('/settings')} className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg text-slate-700">
                 <Settings className="w-5 h-5" /> Settings
               </button>
               <button className="w-full flex items-center gap-3 p-3 hover:bg-slate-100 rounded-lg text-slate-700">
                 <HelpCircle className="w-5 h-5" /> Help & Support
               </button>
               {isAuthenticated && (
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-red-50 text-red-600 rounded-lg mt-2"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};
