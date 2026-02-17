import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Signup
    login({ name, email, phone: '9999999999' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
        <div className="flex items-center mb-6">
            <button onClick={() => navigate('/login')} className="p-2 hover:bg-slate-100 rounded-full transition-colors -ml-2">
            <ArrowLeft className="w-6 h-6 text-slate-400" />
            </button>
            <span className="ml-2 text-xl font-bold text-slate-800">Create Account</span>
        </div>

         <form onSubmit={handleSignup} className="w-full space-y-5">
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
               <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 font-medium"
                  placeholder="John Doe"
                  required
                />
            </div>
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
               <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 font-medium"
                  placeholder="john@example.com"
                  required
                />
            </div>
            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-violet-200 transition-all active:scale-[0.98] mt-4"
            >
              Create Account
            </button>
         </form>
      </div>
    </div>
  );
};