import React, { useState, useEffect } from 'react';
import { MOCK_PRODUCTS } from '../constants';
import { ProductCard } from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingBag } from 'lucide-react';

export const Wishlist: React.FC = () => {
    const navigate = useNavigate();
    const [wishlistProducts, setWishlistProducts] = useState<typeof MOCK_PRODUCTS>([]);

    useEffect(() => {
        const wishlistIds = JSON.parse(localStorage.getItem('spire_wishlist') || '[]');
        const products = MOCK_PRODUCTS.filter(p => wishlistIds.includes(p.id));
        setWishlistProducts(products);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-20 px-4 py-3 flex items-center gap-3 shadow-sm border-b border-slate-100">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </button>
                <h1 className="text-lg font-bold text-slate-800">My Wishlist</h1>
                <div className="ml-auto bg-red-50 text-red-500 px-3 py-1 rounded-full text-xs font-bold">
                    {wishlistProducts.length} items
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-4">
                {wishlistProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                            <Heart className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Your wishlist is empty</h2>
                        <p className="text-slate-500 mb-6">Explore our categories and save items for later.</p>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-red-500 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {wishlistProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};