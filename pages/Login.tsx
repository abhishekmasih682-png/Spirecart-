import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, ArrowLeft, Sparkles } from 'lucide-react';
import { APP_LOGO } from '../constants';

export const Login: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    // Simulate OTP sent
    setTimeout(() => alert(`OTP sent to ${phone}: 12345`), 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate 5 digit OTP
    if (otp.length === 5) {
      login({ name: 'Spire User', phone: phone });
      navigate('/');
    } else {
      alert('Please enter a valid 5-digit OTP');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          
          <button onClick={() => navigate('/')} className="mb-6 p-2 hover:bg-slate-100 rounded-full transition-colors self-start">
             <ArrowLeft className="w-6 h-6 text-slate-400" />
          </button>

          <div className="flex flex-col items-center mb-8">
             <div className="w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-violet-200 mb-4 transform rotate-3">
                <img src={APP_LOGO} alt="Spirecart Logo" className="w-full h-full object-cover" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 mb-1">Welcome Back</h1>
             <p className="text-slate-500 font-medium">Enter your details to sign in</p>
          </div>

         {!otpSent ? (
           <form onSubmit={handleSendOtp} className="w-full space-y-5">
              <div className="space-y-1.5">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone Number</label>
                 <div className="flex items-center bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
                    <span className="pl-4 pr-3 text-slate-500 font-bold border-r border-slate-200 py-3.5">+91</span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // Only allow numbers
                        if (val.length <= 10) setPhone(val);
                      }}
                      placeholder="98765 43210"
                      className="flex-1 p-3.5 bg-transparent outline-none text-slate-900 font-bold placeholder:font-normal"
                      required
                    />
                 </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-violet-200 transition-all active:scale-[0.98]"
              >
                Send OTP
              </button>
           </form>
         ) : (
           <form onSubmit={handleVerifyOtp} className="w-full space-y-5 animate-fadeIn">
              <div className="space-y-1.5">
                 <div className="flex justify-between items-center mb-1 ml-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enter OTP</label>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs text-violet-600 font-bold hover:underline">Change Number</button>
                 </div>
                 <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        if (val.length <= 5) setOtp(val);
                    }}
                    placeholder="• • • • •"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 font-bold text-center tracking-[1em] text-xl"
                    required
                  />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-violet-200 transition-all active:scale-[0.98]"
              >
                Verify & Login
              </button>
           </form>
         )}

         <div className="mt-8 flex items-center w-full">
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="px-4 text-xs text-slate-400 font-bold uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-slate-100"></div>
         </div>

         <div className="mt-6 flex gap-4 w-full justify-center">
            <button className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm text-slate-600 hover:text-slate-900">
               <Mail className="w-6 h-6" />
            </button>
            <button className="p-4 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center w-[58px]">
               <span className="font-bold text-xl">G</span>
            </button>
         </div>
         
         <p className="mt-8 text-xs text-slate-400 text-center font-medium">
           By continuing, you agree to our <span className="text-violet-600 hover:underline cursor-pointer">Terms</span> and <span className="text-violet-600 hover:underline cursor-pointer">Privacy Policy</span>.
         </p>
      </div>
    </div>
  );
};