import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Bell, Lock, MapPin, Globe, Moon, ChevronRight, LogOut, Trash2, Shield, FileText, User } from 'lucide-react';

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { logout, user, isAuthenticated } = useAuth();
  
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
    promo: false,
    whatsapp: true
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({...prev, [key]: !prev[key]}));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6">
           <h2 className="text-xl font-bold text-slate-800 mb-2">Please Login</h2>
           <p className="text-slate-500 mb-4">You need to be logged in to view settings.</p>
           <button onClick={() => navigate('/login')} className="px-6 py-2 bg-red-500 text-white rounded-lg font-bold">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-slate-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
           <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Settings</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
         {/* Account Settings */}
         <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Account</h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div onClick={() => navigate('/profile')} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 p-2 rounded-full text-blue-600"><User className="w-5 h-5" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Edit Profile</p>
                            <p className="text-xs text-slate-500">Name, Email, Photo</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                <div onClick={() => {}} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-green-50 p-2 rounded-full text-green-600"><MapPin className="w-5 h-5" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Saved Addresses</p>
                            <p className="text-xs text-slate-500">Manage your delivery locations</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                 <div onClick={() => {}} className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="bg-purple-50 p-2 rounded-full text-purple-600"><Lock className="w-5 h-5" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Security</p>
                            <p className="text-xs text-slate-500">Password, 2FA</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
            </div>
         </section>

         {/* Preferences */}
         <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Preferences</h3>
             <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-yellow-50 p-2 rounded-full text-yellow-600"><Bell className="w-5 h-5" /></div>
                        <p className="text-sm font-bold text-slate-800">Notifications</p>
                    </div>
                    <div className="space-y-4 pl-12">
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Push Notifications</span>
                            <button 
                                onClick={() => toggleNotification('push')}
                                className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${notifications.push ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${notifications.push ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Email Updates</span>
                            <button 
                                onClick={() => toggleNotification('email')}
                                className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${notifications.email ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                         </div>
                         <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">WhatsApp Alerts</span>
                            <button 
                                onClick={() => toggleNotification('whatsapp')}
                                className={`w-11 h-6 flex items-center rounded-full transition-colors duration-300 ${notifications.whatsapp ? 'bg-green-500' : 'bg-slate-200'}`}
                            >
                                <span className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${notifications.whatsapp ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                         </div>
                    </div>
                </div>
                
                <div onClick={() => {}} className="flex items-center justify-between p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2 rounded-full text-indigo-600"><Globe className="w-5 h-5" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Language</p>
                            <p className="text-xs text-slate-500">English (India)</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                 <div onClick={() => {}} className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="bg-slate-100 p-2 rounded-full text-slate-600"><Moon className="w-5 h-5" /></div>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Appearance</p>
                            <p className="text-xs text-slate-500">Light Mode</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
            </div>
         </section>

         {/* Legal & Support */}
         <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Legal & Support</h3>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-50">
                 <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Terms of Service</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
                 <div className="flex items-center justify-between p-4 hover:bg-slate-50 cursor-pointer transition-colors">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700">Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                </div>
            </div>
         </section>

         {/* Danger Zone */}
         <section>
            <button 
                onClick={() => { logout(); navigate('/'); }}
                className="w-full bg-white border border-slate-200 p-4 rounded-xl flex items-center justify-center gap-2 text-red-600 font-bold hover:bg-red-50 transition-colors mb-3 shadow-sm"
            >
                <LogOut className="w-5 h-5" /> Log Out
            </button>
            <div className="flex justify-center">
                <button className="text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors py-2 px-4">
                    <Trash2 className="w-3 h-3" /> Delete Account
                </button>
            </div>
            <p className="text-center text-[10px] text-slate-400 mt-4">Version 2.4.0 (Build 2024)</p>
         </section>
      </div>
    </div>
  );
};
