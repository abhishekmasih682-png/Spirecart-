import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { useCart } from '../context/CartContext';
import { 
  ArrowLeft, Star, ShoppingBag, Truck, ShieldCheck, Store, Heart, 
  Share2, ChevronRight, Minus, Plus, Clock, CreditCard, ChevronDown, ChevronUp, Info,
  MessageSquare, ThumbsUp, X, User, CheckCircle2, Zap, Facebook, Twitter, Copy, Check, Link as LinkIcon, MapPin
} from 'lucide-react';
import { Product, CategoryType, Review } from '../types';
import { ProductCard } from '../components/ProductCard';

// WhatsApp Icon Component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// Collapsible Accordion Component
interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
}

const Accordion: React.FC<React.PropsWithChildren<AccordionProps>> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white mb-3 shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
      >
        <span className="font-bold text-slate-800 text-sm">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {isOpen && (
        <div className="p-4 bg-slate-50/50 text-sm text-slate-600 leading-relaxed border-t border-slate-100 animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );
};

// Mock reviews generator
const generateMockReviews = (productId: string): Review[] => [
  { id: 'r1', productId, userName: 'Rahul Kumar', rating: 5, comment: 'Absolutely amazing! Worth every penny. The quality is top-notch and delivery was super fast.', date: '2 days ago', helpfulCount: 14, verifiedPurchase: true },
  { id: 'r2', productId, userName: 'Priya Sharma', rating: 4, comment: 'Good quality, but delivery took a bit longer than expected. Product itself is great though.', date: '1 week ago', helpfulCount: 6, verifiedPurchase: true },
  { id: 'r3', productId, userName: 'Vikram Singh', rating: 5, comment: 'Exceeded my expectations. Highly recommended to everyone looking for this.', date: '2 weeks ago', helpfulCount: 10, verifiedPurchase: true },
];

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, items, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Variant State
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  
  // Delivery State
  const [deliveryPincode, setDeliveryPincode] = useState<string>('560038');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Share State
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Related Products State
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Zoom State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transform: 'scale(1)',
    transformOrigin: 'center center'
  });

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    setProduct(found);
    
    // Reset variants
    setSelectedSize('');
    setSelectedColor('');
    setDeliveryType('standard');
    setQuantity(1);

    if (found) {
         const wishlist = JSON.parse(localStorage.getItem('spire_wishlist') || '[]');
         setIsWishlisted(wishlist.includes(found.id));
         setReviews(generateMockReviews(found.id));
         
         // Filter related products based on category, excluding current product
         const related = MOCK_PRODUCTS.filter(p => p.category === found.category && p.id !== found.id).slice(0, 8);
         setRelatedProducts(related);

         // Set defaults if available
         if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
         if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
    }

    // Get Pincode
    const savedAddresses = JSON.parse(localStorage.getItem('spire_addresses') || '[]');
    const defaultAddr = savedAddresses.find((a: any) => a.isDefault);
    if (defaultAddr) {
        setDeliveryPincode(defaultAddr.zip);
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

  const handleReviewSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!product) return;
      
      const newReview: Review = {
          id: `r-${Date.now()}`,
          productId: product.id,
          userName: 'You', // In a real app, use auth user name
          rating: newReviewRating,
          comment: newReviewComment,
          date: 'Just now',
          helpfulCount: 0,
          verifiedPurchase: true
      };
      
      setReviews([newReview, ...reviews]);
      setIsReviewModalOpen(false);
      setNewReviewComment('');
      setNewReviewRating(5);
      setHoverRating(0);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product?.name} on Spirecart!`;
    let shareUrl = '';

    switch(platform) {
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'copy':
            navigator.clipboard.writeText(url);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
            return;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
    if (platform !== 'copy') setIsShareModalOpen(false);
  };

  const getSellerStats = (sellerName: string) => {
      return {
          rating: 4.8,
          years: 3,
          followers: '2.5k',
          products: 120
      };
  };

  const getDeliveryDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  // Zoom Handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: 'scale(2)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
        transformOrigin: 'center center',
        transform: 'scale(1)',
    });
  };

  if (!product) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <p>Loading Product...</p>
          </div>
      );
  }

  // Calculate quantity specific to the SELECTED variant
  const currentVariantItem = items.find(i => 
    i.id === product.id && 
    i.selectedSize === (selectedSize || undefined) && 
    i.selectedColor === (selectedColor || undefined)
  );
  const variantQuantity = currentVariantItem ? currentVariantItem.quantity : 0;

  const handleAddToCart = () => {
      if (!product) return;
      addToCart(product, { 
          size: selectedSize || undefined, 
          color: selectedColor || undefined,
          quantity: quantity
      });
  };

  const handleUpdateVariantQuantity = (qty: number) => {
      if (currentVariantItem) {
          updateQuantity(currentVariantItem.cartItemId, qty);
      } else if (qty > 0) {
          handleAddToCart();
      }
  };

  // Helper to render specific details based on category
  const getSpecifications = () => {
    const Row = ({ label, value }: { label: string, value: string }) => (
        <div className="flex justify-between border-b border-slate-100 border-dashed pb-3 mb-3 last:border-0 last:mb-0 last:pb-0">
            <span className="text-slate-500 text-sm">{label}</span>
            <span className="font-bold text-slate-800 text-sm text-right max-w-[60%]">{value}</span>
        </div>
    );

    if (product.category === CategoryType.ELECTRONICS) {
        return (
            <div className="flex flex-col">
                <Row label="Brand" value={product.brand || 'Generic'} />
                <Row label="Model Name" value={product.name} />
                {product.colors && <Row label="Available Colors" value={product.colors.join(', ')} />}
                <Row label="Warranty" value="1 Year Manufacturer Warranty" />
                <Row label="In the Box" value="Device, Charging Cable, Manual" />
            </div>
        );
    } else if (product.category === CategoryType.FASHION) {
        return (
             <div className="flex flex-col">
                <Row label="Brand" value={product.brand || 'Generic'} />
                <Row label="Material" value="Premium Cotton Blend" />
                <Row label="Fit" value="Regular Fit" />
                <Row label="Care" value="Machine Wash" />
                <Row label="Country of Origin" value="India" />
            </div>
        );
    } else if (product.category === CategoryType.FOOD_DELIVERY) {
        return (
             <div className="flex flex-col">
                <Row label="Restaurant" value={product.restaurantName || 'Spire Kitchen'} />
                <Row label="Cuisine" value={product.cuisine || 'Multi-Cuisine'} />
                <Row label="Type" value={product.isVeg ? 'Vegetarian' : 'Non-Vegetarian'} />
                <Row label="Spiciness" value="Medium" />
                <Row label="Portion" value="Serves 1-2" />
            </div>
        );
    } else if (product.category === CategoryType.GROCERY) {
        return (
             <div className="flex flex-col">
                <Row label="Weight/Volume" value={product.weight || 'Standard'} />
                <Row label="Shelf Life" value="3 Days" />
                <Row label="Type" value="Organic / Fresh" />
                <Row label="Storage" value="Keep Refrigerated" />
            </div>
        );
    } else if (product.category === CategoryType.PHARMACY) {
         return (
             <div className="flex flex-col">
                <Row label="Form" value="Tablet / Syrup" />
                <Row label="Prescription" value={product.requiresPrescription ? 'Required' : 'Not Required'} />
                <Row label="Manufacturer" value={product.seller || 'Pharma Corp'} />
                <Row label="Expiry" value="24 Months from Mfd." />
            </div>
        );
    }

    return (
        <div className="flex flex-col">
             <Row label="SKU" value={product.id} />
             <Row label="Category" value={product.category} />
             <Row label="Seller" value={product.seller || 'Spire Retail'} />
             <Row label="Quality" value="Verified" />
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-28 animate-fadeIn">
       {/* Sticky Header */}
       <div className="bg-white/90 backdrop-blur-md sticky top-0 z-20 px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
               <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
          </div>
          <div className="flex items-center gap-2">
             <button onClick={toggleWishlist} className={`p-2 rounded-full transition-colors ${isWishlisted ? 'bg-fuchsia-50 text-fuchsia-600' : 'hover:bg-slate-100 text-slate-600'}`}>
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
             </button>
             {/* Header Share Button Removed - Now using Persistent FAB below */}
          </div>
       </div>

       {/* Persistent Share FAB */}
       <button 
          onClick={() => setIsShareModalOpen(true)}
          className="fixed top-24 right-4 z-30 p-3 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 rounded-full shadow-lg hover:bg-white hover:text-violet-600 transition-all transform hover:scale-110 active:scale-95"
          aria-label="Share"
       >
          <Share2 className="w-5 h-5" />
       </button>

       {/* Product Image */}
       <div 
         className="bg-white mb-3 p-8 flex items-center justify-center h-[350px] relative rounded-b-3xl shadow-sm overflow-hidden cursor-zoom-in group"
         onMouseMove={handleMouseMove}
         onMouseLeave={handleMouseLeave}
       >
           <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none"></div>
           <img 
             src={product.image} 
             alt={product.name} 
             style={zoomStyle}
             className="h-full w-full object-contain relative z-10 drop-shadow-xl transition-transform duration-100 ease-linear origin-center will-change-transform" 
           />
           {product.discount && (
               <div className="absolute bottom-6 left-6 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg z-20">
                   {product.discount}% OFF
               </div>
           )}
       </div>

       {/* Product Info */}
       <div className="bg-white p-5 mx-3 rounded-3xl shadow-sm mb-3 border border-slate-50">
           <div className="flex items-start justify-between mb-3">
               <div>
                   <p className="text-xs text-violet-600 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                       <Zap className="w-3 h-3 fill-current" />
                       {product.brand || product.restaurantName || 'Generic'}
                   </p>
                   <h1 className="text-2xl font-black text-slate-900 leading-tight mb-1">{product.name}</h1>
               </div>
               <div className="flex flex-col items-end bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-100">
                   <div className="flex items-center gap-1 font-bold text-green-700 text-sm">
                       {product.rating} <Star className="w-3.5 h-3.5 fill-current" />
                   </div>
                   <span className="text-[10px] text-slate-400 font-medium">{product.reviews} ratings</span>
               </div>
           </div>
           
           <p className="text-sm text-slate-600 mb-5 leading-relaxed">{product.details || product.description}</p>
           
           {/* Variants Selection */}
           {(product.sizes || product.colors) && (
               <div className="mb-5 space-y-5 border-t border-slate-100 pt-5">
                   {/* Colors */}
                   {product.colors && product.colors.length > 0 && (
                       <div>
                           <div className="flex justify-between items-center mb-3">
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Color</p>
                               {!selectedColor.startsWith('#') && selectedColor && <span className="text-xs font-bold text-slate-900 capitalize">{selectedColor}</span>}
                           </div>
                           <div className="flex flex-wrap gap-3">
                               {product.colors.map(color => (
                                   <button 
                                       key={color}
                                       onClick={() => setSelectedColor(color)}
                                       title={color}
                                       className={`group relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none ${
                                           selectedColor === color 
                                           ? 'ring-2 ring-offset-2 ring-slate-900 scale-110' 
                                           : 'hover:scale-110 ring-1 ring-slate-200'
                                       }`}
                                   >
                                       <span className="sr-only">{color}</span>
                                       <div 
                                           className="w-full h-full rounded-full border border-black/10 shadow-sm" 
                                           style={{ backgroundColor: color }} 
                                       />
                                       {selectedColor === color && (
                                           <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-md">
                                               <Check className="w-5 h-5" strokeWidth={3} />
                                           </div>
                                       )}
                                   </button>
                               ))}
                           </div>
                       </div>
                   )}
                   
                   {/* Sizes */}
                   {product.sizes && product.sizes.length > 0 && (
                       <div>
                           <div className="flex justify-between items-center mb-3">
                               <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Size</p>
                               {selectedSize && <span className="text-xs font-bold text-slate-900">{selectedSize}</span>}
                           </div>
                           <div className="flex flex-wrap gap-2">
                               {product.sizes.map(size => (
                                   <button 
                                       key={size}
                                       onClick={() => setSelectedSize(size)}
                                       className={`h-10 min-w-[3rem] px-3 rounded-xl text-sm font-bold border transition-all duration-200 flex items-center justify-center ${
                                           selectedSize === size 
                                           ? 'bg-slate-900 text-white border-slate-900 shadow-md transform scale-105' 
                                           : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                       }`}
                                   >
                                       {size}
                                   </button>
                               ))}
                           </div>
                       </div>
                   )}
               </div>
           )}

           {/* Quick Add To Cart / Quantity Selector */}
           <div className="mt-6 mb-4 flex flex-wrap items-center gap-3">
               <div className="flex items-center bg-white border border-slate-200 rounded-xl h-11 w-fit shadow-sm">
                   <button 
                       onClick={() => {
                           if (variantQuantity > 0) {
                               handleUpdateVariantQuantity(variantQuantity - 1);
                           } else {
                               setQuantity(Math.max(1, quantity - 1));
                           }
                       }}
                       className={`w-11 h-full flex items-center justify-center rounded-l-xl transition-colors ${
                           (variantQuantity === 0 && quantity === 1) 
                           ? 'text-slate-300 cursor-not-allowed' 
                           : 'text-slate-600 hover:bg-slate-50 hover:text-red-500'
                       }`}
                       disabled={variantQuantity === 0 && quantity === 1}
                   >
                       <Minus className="w-4 h-4" />
                   </button>
                   <span className="w-8 text-center font-bold text-slate-900">
                       {variantQuantity > 0 ? variantQuantity : quantity}
                   </span>
                   <button 
                       onClick={() => {
                           if (variantQuantity > 0) {
                               handleUpdateVariantQuantity(variantQuantity + 1);
                           } else {
                               setQuantity(quantity + 1);
                           }
                       }}
                       className="w-11 h-full flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:text-green-600 rounded-r-xl transition-colors"
                   >
                       <Plus className="w-4 h-4" />
                   </button>
               </div>

               {variantQuantity > 0 ? (
                   <button 
                        onClick={() => navigate('/checkout')}
                        className="bg-violet-600 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 active:scale-95"
                   >
                        <CreditCard className="w-4 h-4" /> Buy Now
                   </button>
               ) : (
                   <>
                       <button 
                           onClick={handleAddToCart}
                           className="bg-slate-900 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 active:scale-95"
                       >
                           <ShoppingBag className="w-4 h-4" /> Add to Cart
                       </button>
                       <button 
                           onClick={() => {
                               handleAddToCart();
                               navigate('/checkout');
                           }}
                           className="bg-violet-600 text-white font-bold h-11 px-6 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200 active:scale-95"
                       >
                           <CreditCard className="w-4 h-4" /> Buy Now
                       </button>
                   </>
               )}
           </div>

           <div className="flex items-end gap-3 mb-2">
               <span className="text-4xl font-black text-slate-900 tracking-tight">₹{product.price.toLocaleString()}</span>
               {(product.originalPrice || (product.discount && product.discount > 0)) && (
                   <>
                       <span className="text-xl text-slate-400 line-through mb-1.5 font-medium">
                           ₹{product.originalPrice ? product.originalPrice.toLocaleString() : Math.round(product.price * (100 / (100 - (product.discount || 0)))).toLocaleString()}
                       </span>
                   </>
               )}
           </div>
           <p className="text-xs text-slate-500 font-bold bg-slate-50 inline-block px-2 py-1 rounded">Inclusive of all taxes</p>
       </div>

       {/* Info, Delivery & Seller */}
        <div className="bg-white p-5 mx-3 rounded-3xl shadow-sm mb-3 space-y-5 border border-slate-50">
           {/* Refined Seller Card */}
           <div className="bg-gradient-to-br from-violet-50 to-white rounded-2xl p-4 border border-violet-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

              <div className="relative z-10">
                  {product.category === CategoryType.FOOD_DELIVERY ? (
                      <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-xl text-orange-600 shadow-sm border border-orange-100">
                                 {(product.restaurantName || 'R').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Restaurant</p>
                                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-1">
                                      {product.restaurantName}
                                      <ShieldCheck className="w-4 h-4 text-blue-500" />
                                  </h4>
                                  <p className="text-xs text-slate-500 font-medium mt-1">{product.cuisine}</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => navigate(`/store/${encodeURIComponent(product.restaurantName || '')}`)}
                            className="bg-white border border-orange-200 text-orange-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-orange-50 transition-colors flex items-center gap-1.5"
                          >
                            <Store className="w-3.5 h-3.5" /> Menu
                          </button>
                      </div>
                  ) : (
                      <>
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex gap-4">
                                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-bold text-xl text-violet-600 shadow-sm border border-violet-100">
                                     {(product.seller || 'S').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Sold By</p>
                                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-1">
                                          {product.seller || 'Spire Retail'}
                                          <ShieldCheck className="w-4 h-4 text-blue-500" />
                                      </h4>
                                      <div className="flex items-center gap-2 mt-1">
                                          <div className="flex items-center gap-1 bg-green-600 text-white text-[10px] px-2 py-0.5 rounded-md font-bold shadow-sm">
                                              {getSellerStats(product.seller || '').rating} <Star className="w-2.5 h-2.5 fill-current" />
                                          </div>
                                          <span className="text-xs text-slate-500 font-medium">
                                              • {getSellerStats(product.seller || '').products} Products
                                          </span>
                                      </div>
                                  </div>
                              </div>
                              <button 
                                onClick={() => navigate(`/store/${encodeURIComponent(product.seller || 'Spire Retail')}`)}
                                className="bg-white border border-violet-200 text-violet-700 px-3 py-1.5 rounded-xl text-xs font-bold shadow-sm hover:bg-violet-50 transition-colors flex items-center gap-1.5"
                              >
                                <Store className="w-3.5 h-3.5" /> Visit
                              </button>
                          </div>

                          {/* Seller Stats Grid */}
                          <div className="grid grid-cols-3 gap-2 border-t border-violet-100 pt-3">
                              <div className="text-center">
                                  <p className="text-sm font-bold text-slate-800">{getSellerStats(product.seller || '').years} Yrs</p>
                                  <p className="text-[10px] text-slate-400 font-medium">On Platform</p>
                              </div>
                              <div className="text-center border-l border-violet-100">
                                  <p className="text-sm font-bold text-slate-800">{getSellerStats(product.seller || '').followers}</p>
                                  <p className="text-[10px] text-slate-400 font-medium">Followers</p>
                              </div>
                              <div className="text-center border-l border-violet-100">
                                  <p className="text-sm font-bold text-slate-800">98%</p>
                                  <p className="text-[10px] text-slate-400 font-medium">Positive</p>
                              </div>
                          </div>
                      </>
                  )}
              </div>
           </div>

           {/* Trust Strip */}
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-green-50 rounded-xl text-green-600 border border-green-100">
                  <ShieldCheck className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                 <span className="font-bold text-slate-800">Spirecart Verified:</span> 100% Authentic products sourced directly from brands.
              </p>
           </div>
           
           {/* Delivery Estimation */}
           <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        <Truck className="w-4 h-4 text-slate-500" /> Delivery Estimate
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {deliveryPincode}
                        </span>
                        <button onClick={() => navigate('/profile/addresses')} className="text-xs font-bold text-violet-600 hover:underline">Change</button>
                    </div>
                </div>

                {/* Logic for Instant vs Standard */}
                {(product.category === CategoryType.FOOD_DELIVERY || product.category === CategoryType.GROCERY || product.category === CategoryType.PHARMACY) ? (
                     <div className="bg-white rounded-xl p-3 border border-green-200 shadow-sm flex items-center justify-between">
                         <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600 animate-pulse">
                                 <Zap className="w-5 h-5 fill-current" />
                             </div>
                             <div>
                                 <p className="font-bold text-slate-800 text-sm">Instant Delivery</p>
                                 <p className="text-xs text-slate-500">Arriving in {product.deliveryTime}</p>
                             </div>
                         </div>
                         <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded uppercase">Free</span>
                     </div>
                ) : (
                    <div className="space-y-2">
                        <label className={`flex items-center justify-between p-3 bg-white border rounded-xl cursor-pointer transition-all ${deliveryType === 'standard' ? 'border-violet-600 ring-1 ring-violet-600' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="delivery" 
                                    className="accent-violet-600 w-4 h-4" 
                                    checked={deliveryType === 'standard'} 
                                    onChange={() => setDeliveryType('standard')}
                                />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Standard Delivery</p>
                                    <p className="text-xs text-slate-500">By {getDeliveryDate(4)}</p>
                                </div>
                            </div>
                            <span className="text-slate-600 font-bold text-xs">Free</span>
                        </label>

                        <label className={`flex items-center justify-between p-3 bg-white border rounded-xl cursor-pointer transition-all ${deliveryType === 'express' ? 'border-violet-600 ring-1 ring-violet-600' : 'border-slate-200 hover:border-slate-300'}`}>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="radio" 
                                    name="delivery" 
                                    className="accent-violet-600 w-4 h-4" 
                                    checked={deliveryType === 'express'} 
                                    onChange={() => setDeliveryType('express')}
                                />
                                <div>
                                    <p className="font-bold text-slate-800 text-sm flex items-center gap-1">
                                        Express Delivery <Zap className="w-3 h-3 text-yellow-500 fill-current" />
                                    </p>
                                    <p className="text-xs text-slate-500">By {getDeliveryDate(1)}</p>
                                </div>
                            </div>
                            <span className="text-slate-900 font-bold text-xs">₹99</span>
                        </label>
                    </div>
                )}
           </div>
        </div>

        {/* Detailed Info Sections (Accordion) */}
        <div className="px-3 pb-4">
             <h3 className="font-bold text-slate-800 text-lg mb-3 flex items-center gap-2 px-2">
                 <Info className="w-5 h-5 text-slate-400" /> Product Details
             </h3>
             
             <Accordion title="Specifications" defaultOpen={true}>
                 {getSpecifications()}
             </Accordion>

             <Accordion title="Manufacturing & Import Info">
                 <div className="flex flex-col gap-2">
                     <div>
                         <span className="text-slate-500 block text-xs uppercase tracking-wide font-bold">Manufacturer Name</span>
                         <span className="text-slate-800 font-medium">{product.seller || product.restaurantName || 'Spire Manufacturing Ltd.'}</span>
                     </div>
                     <div>
                         <span className="text-slate-500 block text-xs uppercase tracking-wide font-bold">Country of Origin</span>
                         <span className="text-slate-800 font-medium">India</span>
                     </div>
                     <div>
                         <span className="text-slate-500 block text-xs uppercase tracking-wide font-bold">Address</span>
                         <span className="text-slate-800 font-medium">Building 12, Industrial Area, Bangalore - 560001</span>
                     </div>
                 </div>
             </Accordion>
             
             {product.category !== CategoryType.FOOD_DELIVERY && (
                 <Accordion title="Usage & Care">
                     <p>
                        {product.category === CategoryType.FASHION ? "Machine wash cold with like colors. Do not bleach. Tumble dry low. Warm iron if needed." :
                         product.category === CategoryType.ELECTRONICS ? "Keep away from water and direct heat. Clean with a soft, dry cloth only." :
                         product.category === CategoryType.PHARMACY ? "Store in a cool, dry place. Keep out of reach of children." :
                         "Handle with care. Store in appropriate conditions as mentioned on the package."}
                     </p>
                 </Accordion>
             )}
        </div>

       {/* Reviews Section */}
       <div className="px-3 pb-4 mt-2">
           <div className="flex items-center justify-between mb-3 px-2">
               <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                   <MessageSquare className="w-5 h-5 text-slate-400" /> Ratings & Reviews
               </h3>
               <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="text-violet-600 text-sm font-bold hover:underline"
               >
                 Write a Review
               </button>
           </div>
           
           <div className="bg-white rounded-3xl border border-slate-100 p-5 mb-4 shadow-sm">
               <div className="flex items-center gap-6">
                   <div className="text-center">
                       <div className="text-4xl font-black text-slate-900 flex items-center justify-center gap-1">
                           {product.rating} <Star className="w-6 h-6 fill-green-500 text-green-500" />
                       </div>
                       <p className="text-xs text-slate-400 font-bold mt-1">{product.reviews} verified reviews</p>
                   </div>
                   <div className="h-12 w-px bg-slate-100"></div>
                   <div className="flex-1 space-y-1.5">
                       {[5, 4, 3, 2, 1].map((star) => (
                           <div key={star} className="flex items-center gap-2 text-xs">
                               <span className="font-bold text-slate-600 w-3">{star}</span>
                               <Star className="w-3 h-3 text-slate-300" />
                               <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div 
                                      className="h-full bg-green-500 rounded-full" 
                                      style={{ width: star === 5 ? '70%' : star === 4 ? '20%' : '5%' }}
                                   ></div>
                               </div>
                           </div>
                       ))}
                   </div>
               </div>
           </div>

           <div className="space-y-4">
               {reviews.map((review) => (
                   <div key={review.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
                       <div className="flex justify-between items-start mb-2">
                           <div className="flex items-center gap-3">
                               <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                   <User className="w-5 h-5 text-slate-500" />
                               </div>
                               <div>
                                   <p className="text-sm font-bold text-slate-900">{review.userName}</p>
                                   <p className="text-[10px] text-slate-400 font-medium">{review.date}</p>
                               </div>
                           </div>
                           <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                               {review.rating} <Star className="w-3 h-3 fill-current" />
                           </div>
                       </div>
                       <p className="text-sm text-slate-600 leading-relaxed mb-3 font-medium">{review.comment}</p>
                       
                       <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                           {review.verifiedPurchase ? (
                               <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                   <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Verified Purchase
                               </div>
                           ) : <div></div>}
                           <button className="flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-xs font-bold transition-colors">
                               <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpfulCount})
                           </button>
                       </div>
                   </div>
               ))}
           </div>
       </div>

       {/* Related Products Carousel */}
       {relatedProducts.length > 0 && (
         <div className="mt-6 mb-24 border-t border-slate-100 pt-6">
           <div className="px-4 mb-4 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-lg">Related Products</h3>
              <button onClick={() => navigate('/')} className="text-violet-600 text-xs font-bold">View All</button>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-6 px-4 no-scrollbar">
             {relatedProducts.map(related => (
               <div key={related.id} className="min-w-[160px] w-[160px]">
                 <ProductCard product={related} compact={true} />
               </div>
             ))}
           </div>
         </div>
       )}

       {/* Review Modal */}
       {isReviewModalOpen && (
           <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
               <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-slideInUp">
                   <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                       <h3 className="font-bold text-xl text-slate-800">Write a Review</h3>
                       <button onClick={() => setIsReviewModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                           <X className="w-5 h-5" />
                       </button>
                   </div>
                   <form onSubmit={handleReviewSubmit} className="p-6">
                       <div className="mb-6 text-center">
                           <p className="text-sm text-slate-500 mb-3 font-medium">How would you rate this product?</p>
                           <div 
                                className="flex justify-center gap-3"
                                onMouseLeave={() => setHoverRating(0)}
                           >
                               {[1, 2, 3, 4, 5].map((star) => (
                                   <button
                                       key={star}
                                       type="button"
                                       onClick={() => setNewReviewRating(star)}
                                       onMouseEnter={() => setHoverRating(star)}
                                       className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                   >
                                       <Star 
                                         className={`w-9 h-9 transition-all duration-200 ${
                                            star <= (hoverRating || newReviewRating) 
                                            ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' 
                                            : 'text-slate-200'
                                         }`} 
                                       />
                                   </button>
                               ))}
                           </div>
                           <div className="mt-2 h-5">
                                <span className="text-sm font-bold text-violet-600 animate-fadeIn">
                                    {['', 'Terrible', 'Bad', 'Average', 'Good', 'Excellent'][hoverRating || newReviewRating]}
                                </span>
                           </div>
                       </div>
                       
                       <div className="mb-6">
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Your Review</label>
                           <textarea
                               value={newReviewComment}
                               onChange={(e) => setNewReviewComment(e.target.value)}
                               placeholder="What did you like or dislike about this product?"
                               className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none min-h-[120px] text-sm resize-none"
                               required
                           ></textarea>
                       </div>
                       
                       <button 
                         type="submit"
                         className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all active:scale-[0.98]"
                       >
                           Submit Review
                       </button>
                   </form>
               </div>
           </div>
       )}

       {/* Share Modal */}
       {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slideInUp">
             <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-xl text-slate-800">Share Product</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
             </div>
             
             {/* Product Preview in Modal */}
             <div className="p-4 flex gap-4 bg-slate-50/50">
               <div className="w-16 h-16 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center">
                 <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
               </div>
               <div className="flex-1">
                 <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{product.name}</h4>
                 <p className="text-xs text-slate-500 mt-1">₹{product.price}</p>
               </div>
             </div>

             <div className="p-6 grid grid-cols-4 gap-4">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="flex flex-col items-center gap-2 group"
                >
                   <div className="w-14 h-14 bg-[#25D366]/10 text-[#25D366] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <WhatsAppIcon className="w-8 h-8" />
                   </div>
                   <span className="text-xs font-medium text-slate-600">WhatsApp</span>
                </button>

                <button 
                  onClick={() => handleShare('facebook')}
                  className="flex flex-col items-center gap-2 group"
                >
                   <div className="w-14 h-14 bg-[#1877F2]/10 text-[#1877F2] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Facebook className="w-7 h-7 fill-current" />
                   </div>
                   <span className="text-xs font-medium text-slate-600">Facebook</span>
                </button>

                <button 
                  onClick={() => handleShare('twitter')}
                  className="flex flex-col items-center gap-2 group"
                >
                   <div className="w-14 h-14 bg-black/5 text-black rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Twitter className="w-7 h-7 fill-current" />
                   </div>
                   <span className="text-xs font-medium text-slate-600">X / Twitter</span>
                </button>

                <button 
                  onClick={() => handleShare('copy')}
                  className="flex flex-col items-center gap-2 group"
                >
                   <div className="w-14 h-14 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      {isCopied ? <Check className="w-7 h-7 text-green-600" /> : <LinkIcon className="w-7 h-7" />}
                   </div>
                   <span className="text-xs font-medium text-slate-600">{isCopied ? 'Copied' : 'Copy Link'}</span>
                </button>
             </div>
          </div>
        </div>
       )}

       {/* Bottom Action Bar */}
       <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur border-t border-slate-100 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-30">
           <div className="max-w-2xl mx-auto flex items-center gap-4">
               {variantQuantity > 0 ? (
                   <div className="flex-1 flex items-center justify-between bg-violet-50 border border-violet-100 rounded-2xl p-1 h-14">
                       <button onClick={() => handleUpdateVariantQuantity(variantQuantity - 1)} className="w-14 h-full flex items-center justify-center bg-white rounded-xl shadow-sm text-violet-700 hover:text-red-600 font-bold text-xl transition-colors">-</button>
                       <span className="font-bold text-slate-900">{variantQuantity} in Cart</span>
                       <button onClick={() => handleUpdateVariantQuantity(variantQuantity + 1)} className="w-14 h-full flex items-center justify-center bg-white rounded-xl shadow-sm text-violet-700 hover:text-green-600 font-bold text-xl transition-colors">+</button>
                   </div>
               ) : (
                   <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-white text-slate-900 border border-slate-200 font-bold h-14 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:bg-slate-50 transition-colors"
                   >
                       <ShoppingBag className="w-5 h-5" /> Add to Cart
                   </button>
               )}
               
               <button 
                  onClick={() => {
                      if (variantQuantity === 0) handleAddToCart();
                      navigate('/checkout');
                  }}
                  className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold h-14 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-200 hover:shadow-xl transition-all active:scale-[0.98]"
               >
                   <CreditCard className="w-5 h-5" /> Buy Now
               </button>
           </div>
       </div>

    </div>
  );
};