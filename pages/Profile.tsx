import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, CreditCard, Gift, Settings, LogOut, ChevronRight, 
  ShoppingBag, Heart, Crown, Wallet, Globe, HelpCircle, FileText, 
  Share2, ShieldCheck, Phone, Mail, Edit2, Star 
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-6">{title}</h3>
  );

  const MenuRow = ({ icon, label, sub, onClick, isLast }: any) => (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors ${!isLast ? 'border-b border-slate-50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="bg-slate-50 p-2 rounded-lg text-slate-600">
          {icon}
        </div>
        <div className="text-left">
          <h4 className="font-semibold text-slate-800 text-sm">{label}</h4>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300" />
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full">
           <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">My Profile</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* User Profile Card */}
        <div className="bg-white p-4 mb-2 flex items-center justify-between shadow-sm">
           <div>
              <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
              <p className="text-slate-500 text-sm font-medium">{user?.phone}</p>
              <button className="text-red-500 text-xs font-bold mt-2 flex items-center gap-1 hover:bg-red-50 px-2 py-1 rounded -ml-2 transition-colors">
                 Edit Profile <ChevronRight className="w-3 h-3" />
              </button>
           </div>
           <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-2xl font-bold text-red-500 border-4 border-slate-50">
               {user?.name.charAt(0).toUpperCase()}
           </div>
        </div>

        {/* Quick Grid */}
        <div className="grid grid-cols-2 gap-2 p-2">
            <button 
                onClick={() => navigate('/orders')}
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24 hover:shadow-md transition-shadow"
            >
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-slate-800 text-sm block">Orders</span>
                    <span className="text-[10px] text-slate-400">Check status</span>
                </div>
            </button>
            <button 
                onClick={() => navigate('/profile/addresses')}
                className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24 hover:shadow-md transition-shadow"
            >
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-slate-800 text-sm block">Address</span>
                    <span className="text-[10px] text-slate-400">Save addresses</span>
                </div>
            </button>
             <button className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <Wallet className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-slate-800 text-sm block">Wallet</span>
                    <span className="text-[10px] text-slate-400">₹0.00 balance</span>
                </div>
            </button>
             <button onClick={() => navigate('/wishlist')} className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24 hover:shadow-md transition-shadow">
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-slate-700" />
                </div>
                <div className="text-left">
                    <span className="font-bold text-slate-800 text-sm block">Favorites</span>
                    <span className="text-[10px] text-slate-400">Saved items</span>
                </div>
            </button>
        </div>

        {/* Spire Gold Banner */}
        <div className="px-2 mb-2">
           <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-black rounded-xl p-4 text-white flex items-center justify-between shadow-lg relative overflow-hidden">
               <div className="z-10">
                   <div className="flex items-center gap-2 mb-1">
                       <Crown className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                       <span className="font-black italic text-lg tracking-wide">Spire<span className="text-yellow-400">Gold</span></span>
                   </div>
                   <p className="text-xs text-slate-300 max-w-[200px]">Free delivery on every order & extra discounts.</p>
               </div>
               <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg z-10 hover:bg-slate-100">
                   Get Gold
               </button>
               {/* Background decoration */}
               <div className="absolute right-[-20px] bottom-[-40px] w-32 h-32 bg-yellow-500/20 rounded-full blur-2xl"></div>
           </div>
        </div>

        {/* Detailed Menu Lists */}
        
        {/* Section: My Account */}
        <SectionHeader title="My Account" />
        <div className="bg-white mx-2 rounded-xl shadow-sm overflow-hidden">
             <MenuRow 
                icon={<MapPin className="w-5 h-5" />} 
                label="Saved Addresses" 
                sub="Manage delivery locations" 
                onClick={() => navigate('/profile/addresses')} 
            />
            <MenuRow 
                icon={<Star className="w-5 h-5" />} 
                label="Your Ratings" 
                sub="View and edit your product reviews" 
                onClick={() => {}} 
            />
             <MenuRow 
                icon={<Gift className="w-5 h-5" />} 
                label="Coupons & Offers" 
                sub="Promo codes available for you" 
                onClick={() => {}} 
            />
            <MenuRow 
                icon={<Share2 className="w-5 h-5" />} 
                label="Share & Earn" 
                sub="Invite friends and earn cashback" 
                onClick={() => {}} 
                isLast
            />
        </div>

        {/* Section: Support */}
        <SectionHeader title="Support & Information" />
        <div className="bg-white mx-2 rounded-xl shadow-sm overflow-hidden">
             <MenuRow 
                icon={<HelpCircle className="w-5 h-5" />} 
                label="Help & Support" 
                sub="FAQs and Customer Care" 
                onClick={() => {}} 
            />
             <MenuRow 
                icon={<FileText className="w-5 h-5" />} 
                label="Terms & Conditions" 
                onClick={() => {}} 
            />
             <MenuRow 
                icon={<ShieldCheck className="w-5 h-5" />} 
                label="Privacy Policy" 
                onClick={() => {}} 
            />
             <MenuRow 
                icon={<Settings className="w-5 h-5" />} 
                label="Settings" 
                onClick={() => navigate('/settings')} 
                isLast
            />
        </div>

        {/* Logout */}
        <div className="p-4 mt-4">
            <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full bg-red-50 text-red-600 font-bold py-3.5 rounded-xl border border-red-100 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
                <LogOut className="w-5 h-5" /> Log Out
            </button>
            <div className="text-center mt-6 space-y-1">
                <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Spirecart App</p>
                <p className="text-[10px] text-slate-300">v4.2.0 • Made with Gemini</p>
            </div>
        </div>
      </div>
    </div>
  );
};