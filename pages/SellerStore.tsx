import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, Star, ShieldCheck, MapPin, Search } from 'lucide-react';

export const SellerStore: React.FC = () => {
  const { sellerName } = useParams<{ sellerName: string }>();
  const navigate = useNavigate();
  const decodedSellerName = decodeURIComponent(sellerName || 'Unknown Seller');

  // Filter products for this seller (checking both seller field and restaurantName)
  const sellerProducts = MOCK_PRODUCTS.filter(p => 
      (p.seller === decodedSellerName) || (p.restaurantName === decodedSellerName)
  );

  // If no products found (mock data limitation), show some recommendations
  const displayProducts = sellerProducts.length > 0 ? sellerProducts : MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-white sticky top-0 z-20 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-slate-100">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
           <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800 truncate">{decodedSellerName}</h1>
      </div>

      {/* Seller Info Banner */}
      <div className="bg-white p-6 mb-4 border-b border-slate-100">
         <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl font-bold text-slate-600 border border-slate-200 shadow-sm">
                 {decodedSellerName.charAt(0).toUpperCase()}
             </div>
             <div>
                 <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">{decodedSellerName}</h2>
                 <div className="flex items-center gap-2 text-sm text-slate-500">
                     <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold text-xs">
                         4.8 <Star className="w-3 h-3 fill-current" />
                     </span>
                     <span>• 2.5k Followers</span>
                 </div>
             </div>
         </div>
         
         <div className="flex gap-4 text-sm text-slate-600 border-t border-slate-100 pt-4">
             <div className="flex items-center gap-1.5">
                 <ShieldCheck className="w-4 h-4 text-blue-500" />
                 <span className="font-medium">Verified Seller</span>
             </div>
             <div className="flex items-center gap-1.5">
                 <MapPin className="w-4 h-4 text-slate-400" />
                 <span>Bangalore, India</span>
             </div>
         </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4">
          <h3 className="font-bold text-slate-800 text-lg mb-4">Products ({displayProducts.length})</h3>
          
          <div className="relative mb-6">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder={`Search in ${decodedSellerName}...`} className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-200" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
              ))}
          </div>
          
          {sellerProducts.length === 0 && (
             <p className="text-center text-slate-400 text-sm mt-8">Showing similar products as this is a demo seller.</p>
          )}
      </div>
    </div>
  );
};