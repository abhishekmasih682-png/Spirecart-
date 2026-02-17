import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Store, Heart, 
  Share2, ChevronRight, Minus, Plus, Clock 
} from 'lucide-react';
import { Product } from '../types';

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    setProduct(found);
    if (found) {
         const wishlist = JSON.parse(localStorage.getItem('spire_wishlist') || '[]');
         setIsWishlisted(wishlist.includes(found.id));
    }
  }, [id]);

  const toggleWishlist = () => {
      if (!product) return;
      const wishlist = JSON.parse(localStorage.getItem('spire_wishlist') || '[]');
      let newWishlist;
      if (isWishlisted) {
          newWishlist = wishlist.filter((wid: string) => wid !== product.id);
          setIsWishlisted(false);
      } else {
          newWishlist = [...wishlist, product.id];
          setIsWishlisted(true);
      }
      localStorage.setItem('spire_wishlist', JSON.stringify(newWishlist));
  };

  const getSellerStats = (sellerName: string) => {
      return {
          rating: 4.8,
          years: 3,
          followers: '2.5k',
          products: 120
      };
  };

  if (!product) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <p>Loading Product...</p>
          </div>
      );
  }

  const cartItems = items.filter(i => i.id === product.id);
  const totalQuantity = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const latestCartItem = cartItems.length > 0 ? cartItems[cartItems.length - 1] : undefined;

  const handleAddToCart = () => {
      addToCart(product);
  };

  const handleUpdateQuantity = (qty: number) => {
      if (latestCartItem) {
          updateQuantity(latestCartItem.cartItemId, qty);
      } else if (qty > 0) {
          addToCart(product);
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-fadeIn">
       {/* Sticky Header */}
       <div className="bg-white sticky top-0 z-20 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={toggleWishlist} className={`p-2 rounded-full transition-colors ${isWishlisted ? 'bg-red-50 text-red-500' : 'hover:bg-slate-100 text-slate-600'}`}>
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
             </button>
             <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
                <Share2 className="w-6 h-6" />
             </button>
          </div>
       </div>

       {/* Product Image */}
       <div className="bg-white mb-2 p-6 flex items-center justify-center h-[300px] relative">
           <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
           {product.discount && (
               <div className="absolute bottom-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                   {product.discount}% OFF
               </div>
           )}
       </div>

       {/* Product Info */}
       <div className="bg-white p-4 mb-2">
           <div className="flex items-start justify-between mb-2">
               <div>
                   <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">{product.brand || product.restaurantName || 'Generic'}</p>
                   <h1 className="text-xl font-bold text-slate-900 leading-snug mb-1">{product.name}</h1>
               </div>
               <div className="flex flex-col items-end bg-green-50 px-2 py-1 rounded-lg">
                   <div className="flex items-center gap-1 font-bold text-green-700 text-sm">
                       {product.rating} <Star className="w-3 h-3 fill-current" />
                   </div>
                   <span className="text-[10px] text-slate-400">{product.reviews} ratings</span>
               </div>
           </div>
           
           <p className="text-sm text-slate-600 mb-4 leading-relaxed">{product.details || product.description}</p>

           <div className="flex items-end gap-3 mb-2">
               <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
               {product.originalPrice && (
                   <span className="text-sm text-slate-400 line-through mb-1">₹{product.originalPrice}</span>
               )}
           </div>
           <p className="text-xs text-slate-500 font-medium">Inclusive of all taxes</p>
       </div>

       {/* Info, Delivery & Seller */}
        <div className="bg-white p-4 mb-2 space-y-4">
           {/* Refined Seller Card */}
           <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 relative overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-4 -mt-4 pointer-events-none"></div>

              <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-3">
                          <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center font-bold text-xl text-indigo-600 shadow-sm border border-indigo-100">
                             {(product.seller || product.restaurantName || 'S').charAt(0).toUpperCase()}
                          </div>
                          <div>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sold By</p>
                              <h4 className="font-bold text-slate-900 text-base flex items-center gap-1">
                                  {product.seller || product.restaurantName || 'Spire Retail'}
                                  <ShieldCheck className="w-4 h-4 text-blue-500" />
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                  <div className="flex items-center gap-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm">
                                      {getSellerStats(product.seller || '').rating} <Star className="w-2.5 h-2.5 fill-current" />
                                  </div>
                                  <span className="text-xs text-slate-500 font-medium">
                                      • {getSellerStats(product.seller || '').products} Products
                                  </span>
                              </div>
                          </div>
                      </div>
                      <button 
                        onClick={() => navigate('/')} 
                        className="bg-white border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-1.5"
                      >
                        <Store className="w-3.5 h-3.5" /> Visit Store
                      </button>
                  </div>

                  {/* Seller Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 border-t border-slate-200 pt-3">
                      <div className="text-center">
                          <p className="text-sm font-bold text-slate-800">{getSellerStats(product.seller || '').years} Yrs</p>
                          <p className="text-[10px] text-slate-400 font-medium">On Platform</p>
                      </div>
                      <div className="text-center border-l border-slate-200">
                          <p className="text-sm font-bold text-slate-800">{getSellerStats(product.seller || '').followers}</p>
                          <p className="text-[10px] text-slate-400 font-medium">Followers</p>
                      </div>
                      <div className="text-center border-l border-slate-200">
                          <p className="text-sm font-bold text-slate-800">98%</p>
                          <p className="text-[10px] text-slate-400 font-medium">Positive</p>
                      </div>
                  </div>
              </div>
           </div>

           {/* Trust Strip */}
           <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-green-50 rounded-full text-green-600">
                  <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                 <span className="font-bold text-slate-700">Spirecart Verified:</span> 100% Authentic products sourced directly from brands or authorized distributors.
              </p>
           </div>
           
           {/* Delivery Info */}
            <div className="flex items-center gap-3 px-2">
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                  <Truck className="w-5 h-5" />
              </div>
              <div>
                  <p className="text-xs text-slate-500">
                     Delivery by <span className="font-bold text-slate-800">{product.deliveryTime || 'Standard Delivery'}</span>
                  </p>
                  {product.isPrime && (
                      <span className="text-[10px] text-[#00A8E1] font-bold italic">Prime</span>
                  )}
              </div>
           </div>
        </div>

       {/* Bottom Action Bar */}
       <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 shadow-lg z-30">
           <div className="max-w-2xl mx-auto flex items-center gap-4">
               {totalQuantity > 0 ? (
                   <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl p-1 h-12">
                       <button onClick={() => handleUpdateQuantity(totalQuantity - 1)} className="w-12 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-800 hover:text-red-600 font-bold text-lg">-</button>
                       <span className="font-bold text-slate-900">{totalQuantity} in Cart</span>
                       <button onClick={() => handleUpdateQuantity(totalQuantity + 1)} className="w-12 h-full flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-800 hover:text-green-600 font-bold text-lg">+</button>
                   </div>
               ) : (
                   <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-900 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors"
                   >
                       <ShoppingBag className="w-5 h-5" /> Add to Cart
                   </button>
               )}
               
               <button 
                  onClick={() => {
                      if (totalQuantity === 0) handleAddToCart();
                      navigate('/checkout');
                  }}
                  className="flex-1 bg-red-500 text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
               >
                   Buy Now
               </button>
           </div>
       </div>

    </div>
  );
};
