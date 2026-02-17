import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { Search, ArrowLeft, Frown } from 'lucide-react';
import { Product } from '../types';

export const SearchResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [results, setResults] = useState<Product[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = MOCK_PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.toLowerCase().includes(lowerQuery) ||
      (p.brand && p.brand.toLowerCase().includes(lowerQuery)) ||
      (p.restaurantName && p.restaurantName.toLowerCase().includes(lowerQuery)) ||
      (p.seller && p.seller.toLowerCase().includes(lowerQuery))
    );
    setResults(filtered);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-slate-100 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
           <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Search Results</h1>
            <p className="text-xs text-slate-500">for "{query}"</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
             <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <Frown className="w-12 h-12 text-slate-400" />
             </div>
             <h2 className="text-xl font-bold text-slate-700 mb-2">No results found</h2>
             <p className="text-sm text-slate-500 mb-6 max-w-xs">
               We couldn't find any items matching "{query}". Try checking for typos or use different keywords.
             </p>
             <button 
               onClick={() => navigate('/')}
               className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg"
             >
               Browse Categories
             </button>
          </div>
        )}
      </div>
    </div>
  );
};