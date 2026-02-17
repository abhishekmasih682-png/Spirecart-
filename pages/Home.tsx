import React, { useState, useEffect } from 'react';
import { CATEGORIES, MOCK_PRODUCTS, FOOD_CUISINES, GROCERY_CATEGORIES, HEALTH_CONCERNS, FASHION_CATEGORIES_QUICK, FASHION_BRANDS, APP_LOGO } from '../constants';
import { CategoryType, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ArrowRight, Clock, MapPin, ChevronRight, Search, Bike, Percent, ShieldCheck, Activity, Star, Zap, CreditCard, Gift, Timer, Flame, ChevronLeft, Utensils, ThumbsUp, Upload, User, Play, Grid, Monitor, Heart, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);
  const navigate = useNavigate();
  const { savedAddresses } = useAuth();

  // Reset selected restaurant when category changes
  useEffect(() => {
     setSelectedRestaurant(null);
     window.scrollTo(0,0);
  }, [activeCategory]);

  const defaultAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
  const addressText = defaultAddress 
    ? `${defaultAddress.area}, ${defaultAddress.city}` 
    : 'Select Location';

  const filteredProducts = activeCategory === 'ALL' 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter(p => p.category === activeCategory);

  // --- SUB-COMPONENT: SUPER APP DASHBOARD (Home 'All') ---
  const SuperAppHome = () => {
    const [currentBanner, setCurrentBanner] = useState(0);
    const banners = [
      { id: 1, bg: 'bg-gradient-to-r from-violet-900 to-indigo-900', title: 'The Grand Electronics Sale', sub: 'Up to 40% OFF on iPhones & Macs', img: 'https://m.media-amazon.com/images/I/710TJuHTMhL._AC_SL1500_.jpg' },
      { id: 2, bg: 'bg-gradient-to-r from-fuchsia-600 to-purple-600', title: 'Fashion Festival', sub: 'Min 50% Off on Top Brands', img: 'https://img.freepik.com/free-photo/portrait-handsome-smiling-stylish-young-man-model-dressed-red-checkered-shirt-fashion-man-posing_158538-4914.jpg?w=360' },
      { id: 3, bg: 'bg-gradient-to-r from-orange-500 to-red-500', title: 'Craving Biryani?', sub: 'Flat ₹150 OFF on first order', img: 'https://b.zmtcdn.com/data/pictures/chains/4/18617404/249154a4066063b36128038b32152a48_o2_featured_v2.jpg' },
    ];

    const stories = [
        { id: 1, img: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', label: 'Offers', ring: 'border-fuchsia-500' },
        { id: 2, img: 'https://cdn-icons-png.flaticon.com/512/3076/3076134.png', label: 'Biryani', ring: 'border-orange-500' },
        { id: 3, img: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png', label: 'Fashion', ring: 'border-pink-500' },
        { id: 4, img: 'https://cdn-icons-png.flaticon.com/512/3655/3655682.png', label: 'Gadgets', ring: 'border-blue-500' },
        { id: 5, img: 'https://cdn-icons-png.flaticon.com/512/2965/2965567.png', label: 'Grocery', ring: 'border-green-500' },
    ];

    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 4000);
      return () => clearInterval(timer);
    }, []);

    const techProducts = MOCK_PRODUCTS.filter(p => p.category === CategoryType.ELECTRONICS);
    const fashionProducts = MOCK_PRODUCTS.filter(p => p.category === CategoryType.FASHION || p.category === CategoryType.BEAUTY);
    const foodProducts = MOCK_PRODUCTS.filter(p => p.category === CategoryType.FOOD_DELIVERY);

    return (
      <div className="animate-fadeIn pb-10">
        
        {/* 1. Spire Stories (Zomato/Insta Style) */}
        <div className="px-4 py-6 overflow-x-auto no-scrollbar">
            <div className="flex gap-5">
                {stories.map(story => (
                    <div key={story.id} className="flex flex-col items-center gap-1.5 cursor-pointer group min-w-[70px]">
                        <div className={`w-18 h-18 p-0.5 rounded-full bg-white border-2 ${story.ring} group-hover:scale-105 transition-transform shadow-sm`}>
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-50 p-1">
                                <img src={story.img} className="w-full h-full object-cover" alt={story.label} />
                            </div>
                        </div>
                        <span className="text-[11px] font-bold text-slate-600 group-hover:text-violet-600 transition-colors">{story.label}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. Hero Carousel */}
        <div className="px-4 mb-8">
          <div className="relative w-full h-52 sm:h-72 rounded-3xl overflow-hidden shadow-2xl group ring-1 ring-black/5">
             {banners.map((banner, index) => (
                <div 
                  key={banner.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentBanner ? 'opacity-100' : 'opacity-0'} ${banner.bg} flex items-center px-8 sm:px-12`}
                >
                   {/* Abstract Pattern Overlay */}
                   <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                   
                   <div className="flex-1 text-white z-10">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block shadow-sm">Exclusive Deal</span>
                      <h2 className="text-3xl sm:text-5xl font-black mb-3 leading-tight drop-shadow-lg">{banner.title}</h2>
                      <p className="text-white/90 text-sm sm:text-lg mb-6 font-medium max-w-md">{banner.sub}</p>
                      <button className="bg-white text-slate-900 px-8 py-3 rounded-2xl font-bold text-sm hover:scale-105 transition-transform shadow-lg hover:shadow-xl">Explore Now</button>
                   </div>
                   <div className="w-1/3 h-full relative hidden sm:block">
                      <img src={banner.img} alt={banner.title} className="absolute right-0 bottom-0 h-[90%] object-contain drop-shadow-2xl" />
                   </div>
                </div>
             ))}
             
             {/* Indicators */}
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {banners.map((_, idx) => (
                   <button 
                     key={idx} 
                     onClick={() => setCurrentBanner(idx)}
                     className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentBanner ? 'bg-white w-8' : 'bg-white/30 w-2'}`}
                   />
                ))}
             </div>
          </div>
        </div>

        {/* 3. Service Grid (Blinkit/Zepto Style) */}
        <div className="px-4 mb-8">
           <h3 className="text-lg font-bold text-slate-800 mb-4 px-1">Explore Categories</h3>
           <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              {CATEGORIES.map((cat) => (
                 <div key={cat.id} onClick={() => setActiveCategory(cat.id)} className="flex flex-col items-center gap-2 cursor-pointer group bg-white p-3 rounded-2xl border border-slate-100 shadow-sm hover:border-violet-200 hover:shadow-md transition-all">
                    <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       {React.cloneElement(cat.icon as React.ReactElement, { className: "w-6 h-6" })}
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 text-center leading-tight group-hover:text-violet-600">{cat.label}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* 4. Bank Offers Strip */}
        <div className="px-4 mb-10">
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {[
                { bank: 'HDFC Bank', code: 'HDFC10', offer: '10% Cashback', color: 'from-blue-600 to-indigo-700' },
                { bank: 'Axis Bank', code: 'AXIS500', offer: 'Flat ₹500 OFF', color: 'from-fuchsia-600 to-pink-700' },
                { bank: 'UPI', code: 'UPIZERO', offer: 'Zero Fee', color: 'from-emerald-500 to-teal-600' },
                { bank: 'Cred', code: 'CRED20', offer: '20% upto ₹100', color: 'from-slate-800 to-black' },
              ].map((offer, idx) => (
                 <div key={idx} className={`min-w-[260px] h-20 rounded-2xl bg-gradient-to-r ${offer.color} text-white flex items-center px-5 relative overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1`}>
                    <div className="flex-1 z-10">
                       <p className="text-[10px] opacity-80 uppercase font-bold tracking-wider mb-0.5">{offer.bank}</p>
                       <p className="font-bold text-xl leading-none">{offer.offer}</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono font-bold border border-white/30 z-10 shadow-sm">
                       {offer.code}
                    </div>
                    <CreditCard className="absolute right-[-15px] bottom-[-15px] w-24 h-24 text-white/10 rotate-12" />
                 </div>
              ))}
           </div>
        </div>

        {/* 5. Flash Sale Section */}
        <div className="bg-gradient-to-r from-rose-50 to-orange-50 py-8 px-4 mb-8 border-y border-rose-100">
           <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-5">
                 <div className="flex items-center gap-3">
                    <div className="bg-rose-500 p-2 rounded-xl text-white shadow-lg shadow-rose-200 animate-pulse">
                       <Flame className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-rose-600 italic uppercase tracking-tight">Flash Sale</h3>
                       <p className="text-xs text-rose-400 font-bold flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded-lg w-fit mt-1">
                          Ending in <Timer className="w-3 h-3" /> 02:45:12
                       </p>
                    </div>
                 </div>
                 <button className="text-rose-600 text-xs font-bold flex items-center gap-1 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors">
                    View All <ChevronRight className="w-3 h-3" />
                 </button>
              </div>
              
              <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
                 {MOCK_PRODUCTS.filter(p => p.discount && p.discount > 15).slice(0, 5).map(p => (
                    <div key={p.id} className="min-w-[180px] w-[180px]">
                       <ProductCard product={p} compact={false} variant={p.category === CategoryType.FASHION ? 'fashion' : 'standard'} theme="red" />
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* 6. Best of Electronics */}
        <div className="px-4 mb-10">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-800">Best of Tech</h3>
              <button 
                onClick={() => setActiveCategory(CategoryType.ELECTRONICS)}
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-violet-100 hover:text-violet-600 transition-colors"
              >
                 <ChevronRight className="w-5 h-5" />
              </button>
           </div>
           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {techProducts.slice(0, 4).map(p => (
                 <ProductCard key={p.id} product={p} theme="blue" />
              ))}
           </div>
        </div>

        {/* 7. Trending Fashion */}
        <div className="px-4 mb-10">
           <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-800">Trending Fashion</h3>
              <button 
                onClick={() => setActiveCategory(CategoryType.FASHION)}
                className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-fuchsia-100 hover:text-fuchsia-600 transition-colors"
              >
                 <ChevronRight className="w-5 h-5" />
              </button>
           </div>
           <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
              {fashionProducts.map(p => (
                 <div key={p.id} className="min-w-[180px] w-[180px]">
                    <ProductCard product={p} variant="fashion" theme="pink" />
                 </div>
              ))}
           </div>
        </div>

        {/* 8. Food & Cravings */}
        <div className="px-4 mb-10">
           <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full blur-3xl -mr-10 -mt-10"></div>
               
               <div className="flex items-center justify-between mb-6 relative z-10">
                  <div>
                     <h3 className="text-xl font-black text-orange-900">Hungry?</h3>
                     <p className="text-sm text-orange-700 font-medium">Order from top restaurants near you</p>
                  </div>
                  <div className="bg-white p-3 rounded-full shadow-sm">
                     <Utensils className="w-6 h-6 text-orange-500" />
                  </div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                  {foodProducts.slice(0, 3).map(p => (
                     <ProductCard key={p.id} product={p} variant="restaurant" theme="orange" />
                  ))}
               </div>
               <button 
                 onClick={() => setActiveCategory(CategoryType.FOOD_DELIVERY)}
                 className="w-full mt-6 bg-white border border-orange-200 text-orange-600 font-bold py-3 rounded-2xl hover:bg-orange-50 transition-colors shadow-sm relative z-10"
               >
                  View All Restaurants
               </button>
           </div>
        </div>
        
        {/* Footer Brand Strip */}
        <div className="bg-slate-900 text-slate-400 py-16 px-4 mt-8 pb-32 rounded-t-[3rem]">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-6 text-center">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-violet-900/50">
                    <img src={APP_LOGO} alt="Spirecart Logo" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-4xl font-black text-white tracking-tighter">Spirecart</span>
                </div>
                <p className="text-sm max-w-md leading-relaxed font-medium opacity-80">India's unified super-app experience. Fashion, Grocery, Food, Pharmacy, and Electronics all in one place. Made for the new era.</p>
                <div className="flex flex-wrap justify-center gap-8 mt-4 border-t border-slate-800 pt-8 w-full max-w-2xl">
                   <span className="hover:text-white cursor-pointer transition-colors font-bold text-sm">About Us</span>
                   <span className="hover:text-white cursor-pointer transition-colors font-bold text-sm">Careers</span>
                   <span className="hover:text-white cursor-pointer transition-colors font-bold text-sm">Privacy Policy</span>
                   <span className="hover:text-white cursor-pointer transition-colors font-bold text-sm">Terms of Service</span>
                   <span className="hover:text-white cursor-pointer transition-colors font-bold text-sm">Partner</span>
                </div>
                <div className="flex gap-4 mt-2">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer text-white"><User className="w-5 h-5"/></div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer text-white"><Play className="w-5 h-5"/></div>
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors cursor-pointer text-white"><Grid className="w-5 h-5"/></div>
                </div>
                <p className="text-xs mt-4 opacity-40 font-mono">© 2024 Spirecart Technologies Pvt Ltd. All rights reserved.</p>
            </div>
        </div>
      </div>
    );
  };

  // --- SUB-COMPONENT: FOOD HOME (Swiggy/Zomato Red Theme) ---
  const FoodHome = () => {
    // Group products by restaurant
    const restaurants = Object.values(filteredProducts.reduce((acc, product) => {
        if (!product.restaurantName) return acc;
        
        if (!acc[product.restaurantName]) {
            acc[product.restaurantName] = {
                info: product,
                items: []
            };
        }
        acc[product.restaurantName].items.push(product);
        return acc;
    }, {} as Record<string, { info: Product, items: Product[] }>));

    // View: Restaurant Menu (Detail)
    if (selectedRestaurant) {
        const restaurantData = restaurants.find(r => r.info.restaurantName === selectedRestaurant);
        
        if (!restaurantData) return <div onClick={() => setSelectedRestaurant(null)}>Restaurant not found. Back</div>;

        return (
            <div className="animate-slideInRight min-h-screen bg-slate-50 pb-20">
                {/* Sticky Header */}
                <div className="sticky top-[105px] z-20 bg-white/90 backdrop-blur-md border-b border-orange-100 p-4 flex items-center gap-3 shadow-sm">
                    <button 
                       onClick={() => setSelectedRestaurant(null)}
                       className="p-2 hover:bg-orange-50 rounded-full transition-colors text-orange-600"
                    >
                        <ArrowRight className="w-5 h-5 rotate-180" />
                    </button>
                    <div>
                        <h2 className="font-bold text-lg leading-tight text-slate-800">{restaurantData.info.restaurantName}</h2>
                        <p className="text-xs text-slate-500">{restaurantData.info.cuisine}</p>
                    </div>
                </div>

                {/* Hero / Info */}
                <div className="bg-white p-4 mb-4">
                    <div className="flex items-start justify-between bg-orange-50 p-5 rounded-3xl border border-orange-100">
                        <div>
                             <h1 className="text-2xl font-black text-slate-800 mb-1">{restaurantData.info.restaurantName}</h1>
                             <p className="text-sm text-slate-500 mb-3">{restaurantData.info.cuisine}</p>
                             <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                                 <div className="flex items-center gap-1 bg-green-600 text-white px-2 py-0.5 rounded-md">
                                     <Star className="w-3 h-3 fill-current" /> {restaurantData.info.rating}
                                 </div>
                                 <div className="flex items-center gap-1 text-slate-500">
                                     <Clock className="w-3 h-3" /> {restaurantData.info.deliveryTime}
                                 </div>
                             </div>
                        </div>
                        <div className="w-20 h-20 bg-white rounded-2xl p-1 shadow-sm border border-orange-100">
                             <img src={restaurantData.info.image} className="w-full h-full object-cover rounded-xl" alt="logo" />
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="px-4">
                    <h3 className="font-bold text-slate-800 mb-4 text-lg">Recommended</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurantData.items.map(item => (
                            <ProductCard key={item.id} product={item} variant="restaurant" theme="orange" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // View: Restaurant List (Zomato Style)
    return (
      <div className="animate-fadeIn pb-20 bg-white">
         {/* Food Hero Banner */}
         <div className="px-4 py-6">
           <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-8 text-white flex justify-between items-center shadow-xl shadow-red-200 relative overflow-hidden">
              <div className="relative z-10">
                 <h2 className="text-3xl font-black mb-2">50% OFF</h2>
                 <p className="text-white/90 text-sm mb-6 font-medium">On your first order from top restaurants</p>
                 <button className="bg-white text-red-600 px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-transform shadow-lg">Claim Now</button>
              </div>
              <img src="https://b.zmtcdn.com/data/o2_assets/d0bd7c9405ac87f6aa65e31fe55800941632716575.png" className="h-40 w-40 object-contain absolute -right-4 -bottom-8 opacity-90 rotate-12" />
           </div>
         </div>
  
         {/* Circular Cuisines */}
         <div className="px-4 py-4">
            <h3 className="text-slate-800 font-bold text-lg mb-5 tracking-tight">Eat what makes you happy</h3>
            <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
               {FOOD_CUISINES.map((c) => (
                  <div key={c.id} className="flex flex-col items-center min-w-[80px] cursor-pointer group">
                     <div className="w-20 h-20 rounded-full overflow-hidden shadow-md mb-2 border-2 border-transparent group-hover:border-red-500 transition-all">
                        <img src={c.image} className="w-full h-full object-cover" />
                     </div>
                     <span className="text-sm font-medium text-slate-700">{c.label}</span>
                  </div>
               ))}
            </div>
         </div>
  
         {/* Restaurant List */}
         <div className="px-4 py-4 bg-orange-50/30 min-h-screen">
            <h3 className="text-slate-800 font-bold text-xl mb-4">{restaurants.length} Restaurants around you</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {restaurants.map((r, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setSelectedRestaurant(r.info.restaurantName!)}
                    className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-orange-100 transition-all cursor-pointer group"
                  >
                     {/* Restaurant Cover Image */}
                     <div className="h-52 relative overflow-hidden">
                        <img src={r.info.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={r.info.restaurantName} />
                        {r.info.discount && (
                            <div className="absolute bottom-4 left-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-r-full shadow-md">
                                FLAT {r.info.discount}% OFF
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1">
                            <Clock className="w-3 h-3 text-green-600" /> {r.info.deliveryTime}
                        </div>
                     </div>
                     
                     {/* Info */}
                     <div className="p-5">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="text-xl font-bold text-slate-800">{r.info.restaurantName}</h3>
                            <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded-lg text-sm font-bold">
                                {r.info.rating} <Star className="w-3 h-3 fill-current" />
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-4 line-clamp-1">{r.info.cuisine}</p>
                        
                        <div className="border-t border-slate-100 my-4"></div>

                        {/* "Selling" / Menu Preview */}
                        <div className="flex items-center gap-3">
                             <div className="bg-red-50 p-2 rounded-full">
                                <Utensils className="w-3.5 h-3.5 text-red-500" />
                             </div>
                             <div className="flex-1 overflow-hidden">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mb-0.5">Selling</p>
                                <p className="text-xs text-slate-600 truncate font-medium">
                                    {r.items.map(i => i.name).join(', ')}
                                </p>
                             </div>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    );
  };

  // --- SUB-COMPONENT: GROCERY HOME (Quick Mart / Blinkit Green Theme) ---
  const GroceryHome = () => (
    <div className="animate-fadeIn bg-yellow-50 min-h-screen pb-20">
      {/* Quick Delivery Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-green-500 px-4 py-8 text-center relative overflow-hidden shadow-sm">
        <h1 className="text-5xl font-black text-slate-900 relative z-10 italic tracking-tighter transform -skew-x-6">
           <span className="text-white drop-shadow-md">10</span> MINS
        </h1>
        <div className="flex items-center justify-center gap-2 text-slate-900 font-bold relative z-10 opacity-90">
           <Bike className="w-5 h-5" />
           <span>Superfast Delivery</span>
        </div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
      </div>

      {/* Search Bar specific to Grocery */}
       <div className="px-4 -mt-6 relative z-20 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-green-100">
             <Search className="w-5 h-5 text-green-500" />
             <input type="text" placeholder="Search 'milk', 'chips', 'bread'..." className="flex-1 outline-none text-sm text-slate-700 placeholder:text-slate-400 font-medium" />
          </div>
       </div>

      {/* Categories Grid - EXPANDED */}
      <div className="px-3 mb-10">
         <h3 className="font-bold text-slate-800 text-lg mb-4 px-1">Shop by Category</h3>
         <div className="grid grid-cols-4 gap-x-2 gap-y-6">
            {GROCERY_CATEGORIES.map((c) => (
               <div key={c.id} className="flex flex-col items-center text-center cursor-pointer group">
                  <div className="bg-green-50 w-full aspect-square rounded-2xl mb-2 flex items-center justify-center relative overflow-hidden border border-green-100 group-hover:border-green-300 transition-all shadow-sm">
                     <img src={c.image} className="w-[85%] h-[85%] object-contain transform group-hover:scale-110 transition-transform duration-300" alt={c.label} />
                  </div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-700 leading-tight px-1">{c.label}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Product Scroll - Dairy & Bread */}
      <div className="px-4 py-8 bg-white border-t border-green-50 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.02)]">
         <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-xl text-slate-800">Dairy, Bread & Eggs</h3>
            <span className="text-green-600 font-bold text-sm cursor-pointer hover:bg-green-50 px-2 py-1 rounded transition-colors">See all</span>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
             {filteredProducts.map(p => <ProductCard key={p.id} product={p} theme="green" />)}
         </div>
      </div>
    </div>
  );

  // --- SUB-COMPONENT: PHARMACY HOME (Tata 1mg Teal Theme) ---
  const PharmacyHome = () => (
    <div className="animate-fadeIn bg-slate-50 min-h-screen">
       {/* Top Banners */}
       <div className="px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-teal-100 rounded-3xl p-6 flex justify-between items-center cursor-pointer hover:bg-teal-200 transition-colors border border-teal-200">
             <div>
                <h3 className="font-bold text-teal-900 text-xl">Order Medicines</h3>
                <p className="text-teal-700 text-sm mt-1 mb-3">Flat 15% Off</p>
                <button className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-teal-700 transition-colors shadow-sm">
                   <Upload className="w-3 h-3" /> Upload Prescription
                </button>
             </div>
             <ShieldCheck className="w-20 h-20 text-teal-500 opacity-60" />
          </div>
          <div className="bg-blue-100 rounded-3xl p-6 flex justify-between items-center cursor-pointer hover:bg-blue-200 transition-colors border border-blue-200">
             <div>
                <h3 className="font-bold text-blue-900 text-xl">Lab Tests</h3>
                <p className="text-blue-700 text-sm mt-1 mb-3">Full body checkup @ $20</p>
                <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">Book Now</button>
             </div>
             <Activity className="w-20 h-20 text-blue-500 opacity-60" />
          </div>
       </div>

       {/* Health Concerns */}
       <div className="px-4 py-4">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Shop by Health Concern</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
             {HEALTH_CONCERNS.map((h) => (
                <div key={h.id} className="bg-white p-5 rounded-2xl border border-teal-50 flex flex-col items-center hover:shadow-lg transition-all cursor-pointer">
                   <img src={h.image} className="w-16 h-16 mb-3 object-contain" />
                   <span className="font-bold text-slate-700">{h.label}</span>
                </div>
             ))}
          </div>
       </div>

       {/* Product Grid */}
       <div className="px-4 py-6">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Popular Products</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProducts.map(p => <ProductCard key={p.id} product={p} theme="teal" />)}
          </div>
       </div>
    </div>
  );

  // --- SUB-COMPONENT: TECH HOME (Amazon/Flipkart Blue Theme) ---
  const TechHome = () => (
    <div className="animate-fadeIn bg-[#EAEDED] min-h-screen">
       {/* Deal of the Day Banner */}
       <div className="px-4 py-6 bg-[#232F3E]">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-slate-800 rounded-none p-8 text-white flex items-center justify-between relative overflow-hidden">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                 <div className="z-10 relative">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm mb-2 inline-block">DEAL OF THE DAY</span>
                    <h2 className="text-3xl font-bold mt-2 mb-2">Apple iPhone 15</h2>
                    <p className="text-slate-300 mb-6 font-medium">Titanium. So strong. So light. So Pro.</p>
                    <button className="bg-[#FF9900] text-black px-6 py-2.5 rounded-sm font-bold hover:bg-[#ffad33] transition-colors">Shop Now</button>
                 </div>
                 <img src="https://m.media-amazon.com/images/I/81+GIkwqLIL._AC_SL1500_.jpg" className="w-48 h-48 object-contain absolute right-4 bottom-4 mix-blend-lighten drop-shadow-2xl" />
              </div>
          </div>
       </div>

       {/* Category Strip */}
       <div className="bg-white py-4 px-4 shadow-sm mb-6 overflow-x-auto no-scrollbar border-y border-slate-200">
          <div className="flex gap-8 min-w-max mx-auto max-w-7xl">
             {['Laptops', 'Mobiles', 'Headphones', 'Cameras', 'Smart Watches', 'Accessories'].map((cat) => (
                <span key={cat} className="text-sm font-bold text-slate-700 hover:text-blue-600 cursor-pointer transition-colors px-2 py-1">{cat}</span>
             ))}
          </div>
       </div>

       {/* Product Grid */}
       <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-8">
           {filteredProducts.map(p => <ProductCard key={p.id} product={p} theme="blue" />)}
       </div>
    </div>
  );

  // --- SUB-COMPONENT: FASHION HOME (Myntra Pink/Purple Theme) ---
  const FashionHome = () => (
    <div className="animate-fadeIn bg-white min-h-screen">
      {/* Hero Banner Slider (Simulated) */}
      <div className="relative w-full h-[450px] bg-pink-50 overflow-hidden">
        <img 
          src="https://img.freepik.com/free-photo/two-beautiful-women-shopping-town_1303-16426.jpg?w=1200" 
          className="w-full h-full object-cover object-top"
          alt="Fashion Hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-8 pb-12">
           <div className="text-white max-w-lg">
             <h3 className="text-xl font-light tracking-[0.3em] uppercase mb-3 text-pink-300">New Season</h3>
             <h1 className="text-6xl font-black italic tracking-tighter mb-6">SUMMER '24</h1>
             <button className="bg-white text-black px-10 py-3 font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors rounded-none">
               Explore Collection
             </button>
           </div>
        </div>
      </div>

      {/* Shop By Category (Circular) */}
      <div className="py-12 px-4">
        <h3 className="text-2xl font-bold text-slate-900 uppercase tracking-widest text-center mb-10 font-serif">Categories to Bag</h3>
        <div className="flex gap-8 overflow-x-auto pb-6 justify-start md:justify-center no-scrollbar px-4">
           {FASHION_CATEGORIES_QUICK.map((c) => (
             <div key={c.id} className="flex flex-col items-center group cursor-pointer min-w-[110px]">
               <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-pink-50 group-hover:border-pink-500 transition-colors shadow-lg">
                 <img src={c.image} alt={c.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               </div>
               <span className="text-sm font-bold text-slate-800 uppercase tracking-wide group-hover:text-pink-600 transition-colors">{c.label}</span>
             </div>
           ))}
        </div>
      </div>

      {/* Grand Brands */}
      <div className="bg-slate-50 py-12 px-4">
         <h3 className="text-xl font-bold text-slate-900 uppercase tracking-widest mb-8 px-2">Grand Global Brands</h3>
         <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar px-2">
            {FASHION_BRANDS.map((b) => (
               <div key={b.id} className="min-w-[160px] h-[90px] bg-white flex items-center justify-center p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <img src={b.image} alt={b.label} className="max-h-full max-w-full grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
               </div>
            ))}
         </div>
      </div>

      {/* Product Grid */}
      <div className="py-12 px-4 max-w-7xl mx-auto">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-wide">Trending Now</h3>
            <span className="text-pink-600 font-bold text-sm cursor-pointer border-b-2 border-pink-600 pb-0.5">VIEW ALL</span>
         </div>
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-0 border-t border-l border-slate-100 shadow-2xl shadow-slate-100">
             {filteredProducts.map(p => <ProductCard key={p.id} product={p} theme="pink" />)}
         </div>
      </div>
    </div>
  );


  // --- MAIN RENDER ---
  return (
    <div className="min-h-screen pb-24 bg-transparent"> {/* bg is handled by index.html mesh */}
      {/* Location Banner (Common) */}
      <div className={`bg-white/80 backdrop-blur-sm border-b border-white/50 py-2 px-4 flex items-center justify-between text-xs sm:text-sm text-slate-600 sticky top-16 z-30 transition-colors ${
          activeCategory === CategoryType.FOOD_DELIVERY ? 'border-orange-200 bg-orange-50/80' : 
          activeCategory === CategoryType.GROCERY ? 'border-green-200 bg-green-50/80' :
          activeCategory === CategoryType.FASHION ? 'border-pink-200 bg-pink-50/80' : 
          activeCategory === CategoryType.ELECTRONICS ? 'border-blue-200 bg-slate-50/80' : 
          ''
      }`}>
         <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (activeCategory !== 'ALL') {
                setActiveCategory('ALL');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/profile/addresses');
              }
            }}
         >
           {activeCategory !== 'ALL' ? (
              <>
                <ChevronLeft className="w-4 h-4 text-slate-900" />
                <span className="font-bold text-slate-900">Back to Super App</span>
              </>
           ) : (
              <>
                <MapPin className="w-4 h-4 text-violet-500" />
                <span className="font-bold text-slate-900">{defaultAddress ? defaultAddress.tag : 'Location'}</span>
                <span className="hidden sm:inline text-slate-600 truncate max-w-xs"> • {addressText}</span>
              </>
           )}
         </div>
         {activeCategory === CategoryType.GROCERY ? (
            <div className="flex items-center gap-1 text-slate-900 font-black bg-yellow-400 px-3 py-1 rounded-lg skew-x-[-10deg] shadow-sm">
              <Clock className="w-3 h-3" />
              <span className="skew-x-[10deg] uppercase text-xs">20 Mins</span>
            </div>
         ) : activeCategory === CategoryType.FOOD_DELIVERY ? (
             <div className="flex items-center gap-1 text-white font-bold bg-red-500 px-3 py-1 rounded-full shadow-sm">
              <Timer className="w-3 h-3" />
              <span className="text-xs">Fast Food</span>
            </div>
         ) : (
            <div className="flex items-center gap-1 text-violet-600 font-bold bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
              <Clock className="w-3 h-3" />
              <span>Standard Delivery</span>
            </div>
         )}
      </div>

      {/* Dynamic Content Area */}
      <div className="max-w-7xl mx-auto">
        {activeCategory === 'ALL' && <SuperAppHome />}
        {activeCategory === CategoryType.FASHION && <FashionHome />}
        {activeCategory === CategoryType.FOOD_DELIVERY && <FoodHome />}
        {activeCategory === CategoryType.GROCERY && <GroceryHome />}
        {activeCategory === CategoryType.PHARMACY && <PharmacyHome />}
        {activeCategory === CategoryType.ELECTRONICS && <TechHome />}
        {(activeCategory === CategoryType.BEAUTY || activeCategory === CategoryType.HOME || activeCategory === CategoryType.TOYS) && (
          <div className="px-4 py-8">
             {/* Default Grid View for other categories */}
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
             </div>
             {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-slate-400">No products found in this category.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};