import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Receipt, ShieldCheck, Sprout } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    items, 
    updateQuantity, 
    cartTotal,
  } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // SpireCart Billing Logic (from Master Prompt)
  const platformFee = 5;
  const deliveryFee = 10; // Fixed nominal fee
  const treeContribution = 3; // Fixed eco-contribution
  const gst = cartTotal * 0.05; // 5% GST
  const grandTotal = cartTotal + platformFee + deliveryFee + treeContribution + gst;

  const handleProceed = () => {
    setIsCartOpen(false);
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slideInRight rounded-l-3xl overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="bg-violet-50 p-2 rounded-xl text-violet-600">
               <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
               <h2 className="text-lg font-black text-slate-800 leading-none">My Cart</h2>
               <p className="text-xs text-slate-400 font-medium mt-0.5">{items.length} Items added</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 bg-slate-50/50">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center animate-pulse">
                 <ShoppingBag className="w-10 h-10 text-slate-300" />
              </div>
              <div className="text-center">
                 <p className="text-xl font-bold text-slate-800 mb-1">Your cart is empty</p>
                 <p className="text-sm text-slate-500">Looks like you haven't added anything yet.</p>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-violet-200 transition-all shadow-md"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Items List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {items.map((item, index) => (
                  <div key={item.cartItemId} className={`flex gap-4 p-4 ${index !== items.length - 1 ? 'border-b border-slate-50' : ''}`}>
                    <div className="w-20 h-20 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-multiply" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-0.5">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                           <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight">{item.name}</h3>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{item.category}</p>
                           {(item.selectedColor || item.selectedSize) && (
                              <div className="flex gap-2 mt-2">
                                {item.selectedColor && (
                                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 flex items-center gap-1 border border-slate-200">
                                    <span className="w-2 h-2 rounded-full border border-slate-300" style={{background: item.selectedColor}}></span>
                                  </span>
                                )}
                                {item.selectedSize && (
                                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-bold border border-slate-200">
                                    {item.selectedSize}
                                  </span>
                                )}
                              </div>
                           )}
                        </div>
                        <span className="font-bold text-slate-900 text-base">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                      
                      <div className="flex items-center gap-3 self-start mt-2">
                        <div className="flex items-center gap-0 bg-white border border-violet-100 rounded-lg h-8 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            className="w-8 h-full flex items-center justify-center text-violet-600 hover:bg-violet-50 rounded-l-lg transition-colors font-bold"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center text-slate-800">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                             className="w-8 h-full flex items-center justify-center text-violet-600 hover:bg-violet-50 rounded-r-lg transition-colors font-bold"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Summary - SpireCart Style */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                 <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-1">
                   <Receipt className="w-4 h-4" /> Bill Details
                 </h3>
                 
                 <div className="space-y-3 text-sm text-slate-600 font-medium">
                    <div className="flex justify-between">
                       <span>Item Total</span>
                       <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="flex items-center gap-1">
                         Delivery Fee
                       </span>
                       <span className="text-slate-800">₹{deliveryFee}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="flex items-center gap-1">
                         Platform Fee
                         <span className="bg-slate-100 text-[10px] px-1 rounded text-slate-500 cursor-pointer">i</span>
                       </span>
                       <span className="text-slate-800">₹{platformFee}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                       <span className="flex items-center gap-1">
                         <Sprout className="w-3.5 h-3.5" /> Tree Contribution
                       </span>
                       <span>₹{treeContribution}</span>
                    </div>
                    <div className="flex justify-between">
                       <span>GST (5%)</span>
                       <span>₹{gst.toFixed(2)}</span>
                    </div>
                 </div>
                 
                 <div className="border-t border-slate-100 border-dashed my-4"></div>
                 
                 <div className="flex justify-between items-center text-slate-900 font-black text-xl">
                    <span>To Pay</span>
                    <span>₹{grandTotal.toFixed(0)}</span>
                 </div>
              </div>
              
              {/* Impact Corner */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-4">
                 <div className="bg-white p-2 rounded-xl shadow-sm">
                    <Sprout className="w-6 h-6 text-emerald-600" />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold text-emerald-900">Every Order Plants a Seed</h4>
                    <p className="text-xs text-emerald-700 leading-relaxed mt-1">
                       Your <b>₹3</b> contribution helps us plant trees across India. 
                       <br/><b>1 Order = 1 Step towards a Greener India.</b>
                    </p>
                 </div>
              </div>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <button 
              onClick={handleProceed}
              className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg hover:shadow-violet-200 active:scale-[0.98] transition-all flex justify-between px-6 items-center"
            >
              <div className="flex flex-col items-start leading-none gap-1">
                 <span className="text-[10px] opacity-80 font-bold tracking-wider uppercase">Grand Total</span>
                 <span className="text-xl">₹{grandTotal.toFixed(0)}</span>
              </div>
              <span className="text-lg flex items-center gap-2">Proceed to Pay <ChevronRight className="w-5 h-5"/></span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Chevron for button
const ChevronRight = ({className}: {className?: string}) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);
