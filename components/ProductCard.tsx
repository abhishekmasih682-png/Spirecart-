import React, { useState, useEffect } from 'react';
import { Product, CategoryType } from '../types';
import { Star, Clock, Plus, Heart, ShieldCheck, Timer, ShoppingBag, Leaf, Flame, Zap, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  variant?: 'standard' | 'restaurant' | 'grocery' | 'pharmacy' | 'tech' | 'fashion';
  compact?: boolean;
  theme?: 'red' | 'green' | 'blue' | 'pink' | 'teal' | 'orange' | 'slate';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant, compact, theme = 'violet' }) => {
  const { addToCart, items, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Theme Color Maps
  const themeColors = {
    red: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-600 hover:text-white',
    green: 'text-green-600 bg-green-50 border-green-200 hover:bg-green-600 hover:text-white',
    blue: 'text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-600 hover:text-white',
    pink: 'text-pink-600 bg-pink-50 border-pink-200 hover:bg-pink-600 hover:text-white',
    teal: 'text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-600 hover:text-white',
    orange: 'text-orange-600 bg-orange-50 border-orange-200 hover:bg-orange-600 hover:text-white',
    slate: 'text-slate-800 bg-slate-100 border-slate-200 hover:bg-slate-800 hover:text-white',
    violet: 'text-violet-600 bg-violet-50 border-violet-200 hover:bg-violet-600 hover:text-white',
  };

  const btnClass = themeColors[theme as keyof typeof themeColors] || themeColors.violet;
  const activeColor = theme === 'red' ? 'text-red-600' : theme === 'green' ? 'text-green-600' : theme === 'pink' ? 'text-pink-600' : 'text-violet-600';

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('spire_wishlist') || '[]');
    setIsWishlisted(wishlist.includes(product.id));
  }, [product.id]);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const wishlist = JSON.parse(localStorage.getItem('spire_wishlist') || '[]');
    let newWishlist;
    if (isWishlisted) {
        newWishlist = wishlist.filter((id: string) => id !== product.id);
        setIsWishlisted(false);
    } else {
        newWishlist = [...wishlist, product.id];
        setIsWishlisted(true);
    }
    localStorage.setItem('spire_wishlist', JSON.stringify(newWishlist));
  };
  
  const productItems = items.filter(i => i.id === product.id);
  const totalQuantity = productItems.reduce((acc, i) => acc + i.quantity, 0);
  const latestCartItem = productItems.length > 0 ? productItems[productItems.length - 1] : undefined;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleUpdateQuantity = (e: React.MouseEvent, qty: number) => {
    e.stopPropagation();
    if (latestCartItem) {
        updateQuantity(latestCartItem.cartItemId, qty);
    } else if (qty > 0) {
        // Fallback if no item exists but we try to increment (e.g. directly from 0 if logic allowed, though typically only used when qty > 0)
        addToCart(product);
    }
  };

  // Determine variant based on category if not explicitly provided
  const cardVariant = variant || (
    product.category === CategoryType.FOOD_DELIVERY ? 'restaurant' :
    product.category === CategoryType.GROCERY ? 'grocery' :
    product.category === CategoryType.PHARMACY ? 'pharmacy' :
    product.category === CategoryType.ELECTRONICS ? 'tech' :
    product.category === CategoryType.FASHION ? 'fashion' :
    product.category === CategoryType.BEAUTY ? 'fashion' :
    'standard'
  );

  // Compact variant for AI Chat
  if (compact) {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-full cursor-pointer hover:shadow-md transition-all group"
      >
        <div className="h-24 w-full bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-2">
           <img src={product.image} className="h-full object-contain group-hover:scale-110 transition-transform" alt={product.name} />
        </div>
        <div className="p-2 flex flex-col flex-1">
           <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</h4>
           <div className="flex items-center justify-between mt-auto pt-1">
              <span className={`text-xs font-bold ${activeColor}`}>₹{product.price}</span>
              <button onClick={handleAddToCart} className={`p-1 rounded-lg transition-colors ${btnClass}`}>
                 <Plus className="w-3 h-3" />
              </button>
           </div>
        </div>
      </div>
    );
  }

  // --- ZOMATO / SWIGGY STYLE ---
  if (cardVariant === 'restaurant') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
      >
        <div className="relative h-48 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {product.discount && (
            <div className="absolute bottom-3 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-r-full shadow-lg">
              FLAT {product.discount}% OFF
            </div>
          )}
          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-xl text-xs font-bold shadow-md flex items-center">
            <Timer className="w-3 h-3 mr-1 text-slate-700" />
            {product.deliveryTime}
          </div>
          <button 
            onClick={toggleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all shadow-sm ${isWishlisted ? 'bg-white text-red-500' : 'bg-white/80 text-slate-600 hover:bg-white hover:text-red-500'}`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{product.restaurantName}</h3>
            <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded-lg text-xs font-bold gap-0.5 shadow-sm">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-current" />
            </div>
          </div>
          <p className="text-slate-500 text-sm mb-3 line-clamp-1">{product.cuisine}</p>
          <div className="border-t border-dashed border-slate-200 my-1"></div>
          <div className="flex items-center justify-between mt-auto pt-3">
            <div className="flex flex-col">
               <div className="flex items-center gap-2">
                   <div className={`w-4 h-4 border ${product.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center rounded-sm`}>
                       <div className={`w-2 h-2 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
                   </div>
                   <span className="text-sm font-semibold text-slate-700 line-clamp-1 max-w-[120px]">{product.name}</span>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-sm font-bold text-slate-900">₹{product.price}</span>
               <button 
                onClick={handleAddToCart}
                className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-lg transition-all active:scale-95 ${theme === 'red' ? 'bg-gradient-to-r from-red-500 to-orange-500 shadow-red-200' : 'bg-slate-900'}`}
               >
                 ADD
               </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- BLINKIT / ZEPTO STYLE ---
  if (cardVariant === 'grocery') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col h-full relative hover:border-green-300 hover:shadow-lg hover:shadow-green-50 transition-all cursor-pointer"
      >
        <div className="h-28 w-full flex items-center justify-center mb-2 relative">
          <img src={product.image} alt={product.name} className="h-full object-contain drop-shadow-md" />
          <button onClick={toggleWishlist} className={`absolute top-0 right-0 p-1.5 rounded-full hover:bg-slate-50 ${isWishlisted ? 'text-red-500' : 'text-slate-300'}`}>
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="flex flex-col flex-grow">
          <div className="mb-1">
             <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-100 text-[9px] font-bold text-slate-500 border border-slate-200">
               <Clock className="w-2.5 h-2.5 text-slate-600" />
               {product.deliveryTime}
             </div>
          </div>
          <h3 className="text-sm font-bold text-slate-800 leading-tight mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-slate-500 mb-3 font-medium">{product.weight}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col">
              {product.discount ? (
                 <>
                   <span className="text-[10px] text-slate-400 line-through">₹{(product.price * (1 + product.discount/100)).toFixed(0)}</span>
                   <span className="text-sm font-bold text-slate-900">₹{product.price}</span>
                 </>
              ) : (
                <span className="text-sm font-bold text-slate-900">₹{product.price}</span>
              )}
            </div>
            {totalQuantity > 0 ? (
               <div className={`flex items-center gap-2 rounded-lg px-2 py-1 shadow-md ${theme === 'green' ? 'bg-green-600 shadow-green-200' : 'bg-slate-900'}`} onClick={e => e.stopPropagation()}>
                 <button onClick={(e) => handleUpdateQuantity(e, totalQuantity - 1)} className="text-white text-sm font-bold">-</button>
                 <span className="text-xs font-bold text-white w-4 text-center">{totalQuantity}</span>
                 <button onClick={(e) => handleUpdateQuantity(e, totalQuantity + 1)} className="text-white text-sm font-bold">+</button>
               </div>
            ) : (
               <button 
                 onClick={handleAddToCart}
                 className={`px-4 py-1.5 border text-xs font-bold rounded-lg transition-colors uppercase tracking-wide ${theme === 'green' ? 'border-green-600 text-green-700 bg-green-50' : 'border-slate-200 text-slate-700'}`}
               >
                 ADD
               </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- TATA 1MG / PHARMACY STYLE ---
  if (cardVariant === 'pharmacy') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-xl hover:shadow-teal-50 transition-all flex flex-col h-full cursor-pointer relative group"
      >
        <button onClick={toggleWishlist} className={`absolute top-2 right-2 p-1 ${isWishlisted ? 'text-red-500' : 'text-slate-300'}`}>
           <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
        {product.safeLogo && (
          <div className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2 py-1 rounded-lg self-start mb-2 flex items-center gap-1 border border-teal-100">
            <ShieldCheck className="w-3 h-3" /> SAFE
          </div>
        )}
        <div className="h-32 flex items-center justify-center mb-4">
          <img src={product.image} alt={product.name} className="h-full object-contain group-hover:scale-105 transition-transform" />
        </div>
        <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{product.description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center gap-2 mb-3">
             <div className="bg-green-50 text-green-700 text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center border border-green-100">
               {product.rating} <Star className="w-2.5 h-2.5 fill-current ml-0.5" />
             </div>
             <span className="text-[10px] text-slate-400 font-medium">{product.reviews} ratings</span>
          </div>
          <div className="flex justify-between items-center">
             <div>
                {product.originalPrice && <span className="text-xs text-slate-400 line-through block">₹{product.originalPrice}</span>}
                <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
             </div>
             <button 
               onClick={handleAddToCart}
               className="text-teal-600 font-bold text-xs hover:bg-teal-600 hover:text-white px-3 py-2 rounded-lg transition-colors border border-teal-100"
             >
               ADD
             </button>
          </div>
        </div>
      </div>
    );
  }

  // --- AMAZON / TECH STYLE ---
  if (cardVariant === 'tech' || cardVariant === 'standard') {
    return (
      <div 
        onClick={handleCardClick}
        className="bg-white p-4 rounded-3xl border border-slate-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-50 transition-all flex flex-col h-full relative group cursor-pointer"
      >
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
          {product.discount && (
             <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm w-fit shadow-md">{product.discount}% off</span>
          )}
           {product.category === CategoryType.ELECTRONICS && (
              <span className="bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded-sm w-fit flex items-center gap-1 shadow-md">
                  <Flame className="w-3 h-3 text-yellow-400 fill-yellow-400" /> BESTSELLER
              </span>
           )}
        </div>
        <div className="h-48 flex items-center justify-center mb-4 bg-white rounded-2xl relative overflow-hidden">
          <img src={product.image} alt={product.name} className="max-h-[85%] max-w-[85%] object-contain z-10 group-hover:scale-110 transition-transform duration-500" />
           <button onClick={toggleWishlist} className={`absolute top-2 right-2 p-2 rounded-full bg-white shadow-md ${isWishlisted ? 'text-red-500' : 'text-slate-300 hover:text-red-500'}`}>
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
           </button>
        </div>
        
        <div className="flex flex-col flex-grow">
          <h3 className="font-bold text-slate-900 text-base leading-snug mb-1 hover:text-blue-600 transition-colors line-clamp-2">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <div className="flex text-yellow-500">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
               ))}
            </div>
            <span className="text-xs text-blue-600 font-medium">({product.reviews})</span>
          </div>
          
          <div className="mt-auto">
             <div className="flex items-baseline gap-2 mb-3">
                <span className="text-2xl font-medium text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                {product.originalPrice && <span className="text-xs text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>}
             </div>
             {product.isPrime && (
                <div className="flex items-center gap-1 mb-3">
                   <div className="w-4 h-4 bg-sky-100 rounded-full flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 text-sky-600 fill-sky-600" />
                   </div>
                   <span className="text-[10px] font-bold text-sky-600 italic">Prime</span>
                   <span className="text-[10px] text-slate-400">• {product.deliveryTime}</span>
                </div>
             )}
             
             {totalQuantity > 0 ? (
                <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-full h-10 px-1" onClick={(e) => e.stopPropagation()}>
                   <button 
                     onClick={(e) => handleUpdateQuantity(e, totalQuantity - 1)}
                     className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-700 hover:text-red-600 font-bold transition-colors"
                   >
                     <Minus className="w-4 h-4" />
                   </button>
                   <span className="font-bold text-slate-900 text-sm px-2">{totalQuantity}</span>
                   <button 
                     onClick={(e) => handleUpdateQuantity(e, totalQuantity + 1)}
                     className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-700 hover:text-green-600 font-bold transition-colors"
                   >
                     <Plus className="w-4 h-4" />
                   </button>
                </div>
             ) : (
                 <button 
                    onClick={handleAddToCart}
                    className="w-full bg-yellow-400 text-slate-900 py-2.5 rounded-full text-sm font-bold shadow-sm hover:bg-yellow-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                   Add to Cart
                 </button>
             )}
          </div>
        </div>
      </div>
    );
  }

  // --- MYNTRA / AJIO STYLE (Fashion & Beauty) ---
  if (cardVariant === 'fashion') {
     return (
        <div 
           onClick={handleCardClick}
           className="bg-white rounded-none border-b border-r border-slate-100 hover:shadow-2xl transition-all group flex flex-col h-full relative cursor-pointer z-0 hover:z-10 hover:border-transparent"
        >
           <div className="relative aspect-[3/4] overflow-hidden">
             <img 
               src={product.image} 
               alt={product.name} 
               className="w-full h-full object-contain sm:object-cover group-hover:scale-105 transition-transform duration-700" 
             />
             {product.discount && (
               <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur text-pink-600 text-[10px] font-bold px-2 py-1 uppercase tracking-wide shadow-sm">
                  {product.discount}% OFF
               </div>
             )}
             <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={toggleWishlist} className={`p-2 bg-white rounded-full shadow-md ${isWishlisted ? 'text-pink-600' : 'text-slate-400 hover:text-pink-600'}`}>
                   <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
             </div>
             {/* "Add to Bag" overlay on hover */}
             <div className="absolute bottom-0 left-0 w-full bg-white/95 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-slate-100 flex items-center justify-center">
                 <button 
                   onClick={handleAddToCart}
                   className="flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-pink-600 uppercase tracking-wider"
                 >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                 </button>
             </div>
           </div>
           
           <div className="p-3">
              <h3 className="font-bold text-slate-900 text-sm mb-0.5 truncate uppercase tracking-tight">{product.brand || 'BRAND'}</h3>
              <p className="text-sm text-slate-500 truncate mb-1.5 font-medium">{product.name}</p>
              <div className="flex items-center gap-2">
                 <span className="font-bold text-slate-900">₹{product.price}</span>
                 {product.originalPrice && (
                    <span className="text-xs text-slate-400 line-through">₹{product.originalPrice}</span>
                 )}
                 {product.discount && (
                    <span className="text-xs text-orange-500 font-bold">({product.discount}% OFF)</span>
                 )}
              </div>
           </div>
        </div>
     );
  }

  return null;
};