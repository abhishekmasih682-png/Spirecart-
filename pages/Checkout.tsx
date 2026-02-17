import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, MapPin, CheckCircle2, ChevronDown, ChevronUp, CreditCard, Wallet, Smartphone, Banknote, ShieldCheck, Truck, Clock, AlertCircle, X, Home, Briefcase, Sprout, Store, Landmark, Zap, Crosshair } from 'lucide-react';

type PaymentMethod = 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET' | 'COD' | 'PAYLATER';

export const Checkout: React.FC = () => {
    const navigate = useNavigate();
    const { items, cartTotal, placeOrder, clearCart } = useCart();
    const { user, isAuthenticated, detectLocation } = useAuth();
    
    // Payment States
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('UPI');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    
    // Dummy Input States for interactions
    const [upiId, setUpiId] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvv, setCardCvv] = useState('');
    
    // Address States
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [currentAddress, setCurrentAddress] = useState({
        tag: 'Home',
        street: '123, Tech Park Residency, Sector 4',
        area: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        zip: '560038'
    });
    
    // Form State
    const [addressForm, setAddressForm] = useState({
        street: '',
        area: '',
        city: '',
        state: '',
        zip: '',
        tag: 'Home'
    });

    // Redirect if empty or not logged in
    useEffect(() => {
        if (!isAuthenticated) navigate('/login');
        if (items.length === 0 && !showSuccess) navigate('/');
    }, [items, isAuthenticated, navigate, showSuccess]);

    // SpireCart Billing Logic (from Master Prompt)
    const platformFee = 5;
    const deliveryFee = 10;
    const treeContribution = 3;
    const gst = cartTotal * 0.05;
    const grandTotal = cartTotal + platformFee + deliveryFee + treeContribution + gst;

    const handlePayment = () => {
        // Basic validation for visual feedback
        if (selectedMethod === 'UPI' && !upiId && !document.querySelector('input[type="radio"]:checked')) {
             // Just a mock check, usually we'd validate deeply
        }

        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            setTimeout(() => {
                placeOrder({ deliveryFee, platformFee, gst, treeContribution, total: grandTotal });
                navigate('/orders');
            }, 3000); // Wait longer to show success impact screen
        }, 2000);
    };

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentAddress({
            tag: addressForm.tag,
            street: addressForm.street,
            area: addressForm.area,
            city: addressForm.city,
            state: addressForm.state,
            zip: addressForm.zip
        });
        setIsAddressModalOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAddressForm(prev => ({ ...prev, [name]: value }));
    };

    const handleDetectLocation = async () => {
        setIsDetecting(true);
        const location = await detectLocation();
        setIsDetecting(false);
        if (location) {
            setAddressForm(prev => ({
                ...prev,
                street: location.street,
                area: location.area,
                city: location.city,
                state: location.state,
                zip: location.zip
            }));
        }
    };

    if (showSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 animate-fadeIn relative overflow-hidden">
                {/* Confetti Background (simulated) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-4 h-4 bg-red-400 rounded-full animate-bounce delay-100"></div>
                    <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400 transform rotate-45 animate-bounce delay-200"></div>
                    <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-[bounce_1s_ease-in-out_infinite]">
                    <CheckCircle2 className="w-16 h-16 text-green-600" />
                </div>
                
                <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Order Placed!</h2>
                <p className="text-slate-500 text-center mb-8">Thank you for shopping on Spirecart.</p>
                
                {/* Impact Cards */}
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 flex flex-col items-center text-center">
                        <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mb-2">
                             <Sprout className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">1 Tree Planted</span>
                        <span className="text-[10px] text-slate-400 mt-1">Impact Verified</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-blue-100 flex flex-col items-center text-center">
                        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-2">
                             <Store className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">Local Support</span>
                        <span className="text-[10px] text-slate-400 mt-1">Verified Seller</span>
                    </div>
                </div>

                <div className="w-full max-w-sm bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-500">Amount Paid</span>
                        <span className="font-bold text-slate-900">₹{grandTotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-500">Payment Mode</span>
                        <span className="font-bold text-slate-900">{selectedMethod === 'COD' ? 'Cash on Delivery' : selectedMethod}</span>
                    </div>
                </div>
                
                <p className="mt-8 text-xs text-slate-400 animate-pulse">Redirecting to orders...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-24 relative">
             {/* Loading Overlay */}
             {isProcessing && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                    <p className="font-bold text-lg">Processing Payment...</p>
                    <p className="text-sm text-white/70">Please do not press back or close the app</p>
                </div>
            )}

            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-slate-100 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft className="w-6 h-6 text-slate-700" />
                </button>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 leading-tight">Payments</h1>
                    <p className="text-xs text-slate-500">{items.length} items • ₹{grandTotal.toFixed(0)}</p>
                </div>
            </div>

            <div className="max-w-2xl mx-auto p-4 space-y-6">
                
                {/* 1. Address Section */}
                <section className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="bg-slate-100 p-2 rounded-lg">
                                <MapPin className="w-5 h-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    {currentAddress.tag} <span className="px-2 py-0.5 bg-slate-100 text-[10px] rounded text-slate-500 uppercase">Default</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-[200px] break-words">
                                    {currentAddress.street}, {currentAddress.area}, {currentAddress.city} - {currentAddress.zip}
                                </p>
                            </div>
                        </div>
                        <button 
                          onClick={() => setIsAddressModalOpen(true)}
                          className="text-red-500 text-xs font-bold uppercase hover:bg-red-50 px-2 py-1 rounded transition-colors"
                        >
                          Change
                        </button>
                    </div>
                </section>

                {/* 2. Payment Options */}
                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Payment Options</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-50">
                        
                        {/* UPI */}
                        <div 
                            onClick={() => setSelectedMethod('UPI')}
                            className={`p-4 cursor-pointer transition-all ${selectedMethod === 'UPI' ? 'bg-violet-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === 'UPI' ? 'border-violet-600' : 'border-slate-300'}`}>
                                    {selectedMethod === 'UPI' && <div className="w-2.5 h-2.5 bg-violet-600 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-white border border-slate-200 p-1.5 rounded"><Smartphone className="w-4 h-4 text-slate-700" /></div>
                                        <span className="font-bold text-slate-800 text-sm">UPI</span>
                                        {selectedMethod === 'UPI' && <span className="text-[10px] bg-green-100 text-green-700 font-bold px-1.5 rounded">Fastest</span>}
                                    </div>
                                    {selectedMethod !== 'UPI' && <p className="text-[10px] text-slate-500 mt-1">Google Pay, PhonePe, Paytm</p>}
                                </div>
                            </div>
                            
                            {selectedMethod === 'UPI' && (
                                <div className="ml-9 mt-4 space-y-3 animate-fadeIn">
                                    <div className="grid grid-cols-3 gap-2">
                                        {['GPay', 'PhonePe', 'Paytm'].map(app => (
                                            <button key={app} className="flex flex-col items-center justify-center gap-1 py-3 px-2 bg-white border border-slate-200 rounded-xl hover:border-violet-500 hover:bg-violet-50 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">{app[0]}</div>
                                                <span className="text-[10px] font-bold text-slate-700">{app}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-violet-50/50 px-2 text-slate-400 font-bold">Or</span></div>
                                    </div>
                                    <div>
                                         <input 
                                            type="text" 
                                            value={upiId}
                                            onChange={(e) => setUpiId(e.target.value)}
                                            placeholder="Enter UPI ID (e.g. 9876543210@upi)"
                                            className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                                         />
                                         <button className="w-full mt-2 bg-violet-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-violet-700 shadow-lg shadow-violet-200">Verify & Pay</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cards */}
                        <div 
                            onClick={() => setSelectedMethod('CARD')}
                            className={`p-4 cursor-pointer transition-all ${selectedMethod === 'CARD' ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                        >
                             <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === 'CARD' ? 'border-blue-600' : 'border-slate-300'}`}>
                                    {selectedMethod === 'CARD' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-white border border-slate-200 p-1.5 rounded"><CreditCard className="w-4 h-4 text-slate-700" /></div>
                                        <span className="font-bold text-slate-800 text-sm">Credit / Debit Card</span>
                                    </div>
                                    {selectedMethod !== 'CARD' && <p className="text-[10px] text-slate-500 mt-1">Visa, Mastercard, RuPay, Amex</p>}
                                </div>
                            </div>

                            {selectedMethod === 'CARD' && (
                                <div className="ml-9 mt-4 space-y-3 animate-fadeIn">
                                    <input 
                                        type="text" 
                                        value={cardNumber}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                                            if (val.length <= 19) setCardNumber(val);
                                        }}
                                        placeholder="Card Number (0000 0000 0000 0000)"
                                        className="w-full p-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                    />
                                    <div className="flex gap-3">
                                        <input 
                                            type="text" 
                                            value={cardExpiry}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 4) {
                                                    const formatted = val.length > 2 ? `${val.slice(0,2)}/${val.slice(2)}` : val;
                                                    setCardExpiry(formatted);
                                                }
                                            }}
                                            placeholder="MM/YY"
                                            className="w-1/2 p-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                        <input 
                                            type="password" 
                                            value={cardCvv}
                                            onChange={(e) => {
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 3) setCardCvv(val);
                                            }}
                                            placeholder="CVV"
                                            className="w-1/2 p-3 border border-slate-300 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    <button className="w-full mt-1 bg-blue-600 text-white py-3 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Pay securely</button>
                                </div>
                            )}
                        </div>

                         {/* Net Banking */}
                         <div 
                            onClick={() => setSelectedMethod('NETBANKING')}
                            className={`p-4 cursor-pointer transition-all ${selectedMethod === 'NETBANKING' ? 'bg-orange-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === 'NETBANKING' ? 'border-orange-500' : 'border-slate-300'}`}>
                                    {selectedMethod === 'NETBANKING' && <div className="w-2.5 h-2.5 bg-orange-500 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-white border border-slate-200 p-1.5 rounded"><Landmark className="w-4 h-4 text-slate-700" /></div>
                                        <span className="font-bold text-slate-800 text-sm">Net Banking</span>
                                    </div>
                                    {selectedMethod !== 'NETBANKING' && <p className="text-[10px] text-slate-500 mt-1">All Indian banks supported</p>}
                                </div>
                            </div>

                             {selectedMethod === 'NETBANKING' && (
                                <div className="ml-9 mt-4 animate-fadeIn">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Popular Banks</p>
                                    <div className="grid grid-cols-3 gap-2 mb-3">
                                        {['HDFC', 'SBI', 'ICICI', 'Axis', 'Kotak'].map(bank => (
                                            <button key={bank} className="py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-colors">
                                                {bank}
                                            </button>
                                        ))}
                                         <button className="py-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-200">Other</button>
                                    </div>
                                </div>
                             )}
                        </div>

                        {/* Pay Later */}
                         <div 
                            onClick={() => setSelectedMethod('PAYLATER')}
                            className={`p-4 cursor-pointer transition-all ${selectedMethod === 'PAYLATER' ? 'bg-fuchsia-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === 'PAYLATER' ? 'border-fuchsia-500' : 'border-slate-300'}`}>
                                    {selectedMethod === 'PAYLATER' && <div className="w-2.5 h-2.5 bg-fuchsia-500 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="bg-white border border-slate-200 p-1.5 rounded"><Zap className="w-4 h-4 text-slate-700" /></div>
                                        <span className="font-bold text-slate-800 text-sm">Pay Later</span>
                                    </div>
                                    {selectedMethod !== 'PAYLATER' && <p className="text-[10px] text-slate-500 mt-1">Simpl, Lazypay, SpirePostpaid</p>}
                                </div>
                            </div>
                            
                            {selectedMethod === 'PAYLATER' && (
                                <div className="ml-9 mt-4 space-y-2 animate-fadeIn">
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-fuchsia-400 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs italic">S</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">Simpl</p>
                                                <p className="text-[10px] text-slate-400">Link account to check limit</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded">Link</button>
                                    </div>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between hover:border-fuchsia-400 cursor-pointer">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-xs">L</div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">LazyPay</p>
                                                <p className="text-[10px] text-slate-400">Not linked</p>
                                            </div>
                                        </div>
                                        <button className="text-[10px] font-bold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded">Link</button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Wallets */}
                        <div 
                            onClick={() => setSelectedMethod('WALLET')}
                            className={`p-4 cursor-pointer transition-all ${selectedMethod === 'WALLET' ? 'bg-cyan-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === 'WALLET' ? 'border-cyan-500' : 'border-slate-300'}`}>
                                    {selectedMethod === 'WALLET' && <div className="w-2.5 h-2.5 bg-cyan-500 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white border border-slate-200 p-1.5 rounded"><Wallet className="w-4 h-4 text-slate-700" /></div>
                                        <span className="font-bold text-slate-800 text-sm">Wallets</span>
                                    </div>
                                    {selectedMethod !== 'WALLET' && <p className="text-[10px] text-slate-400 mt-1">Paytm, Amazon Pay, Mobikwik</p>}
                                </div>
                            </div>
                        </div>

                         {/* COD */}
                         <div 
                            onClick={() => setSelectedMethod('COD')}
                            className={`p-4 cursor-pointer transition-all ${selectedMethod === 'COD' ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedMethod === 'COD' ? 'border-emerald-500' : 'border-slate-300'}`}>
                                    {selectedMethod === 'COD' && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-white border border-slate-200 p-1.5 rounded"><Banknote className="w-4 h-4 text-slate-700" /></div>
                                        <span className="font-bold text-slate-800 text-sm">Pay on Delivery</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Cash or UPI at doorstep</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* 3. Bill Summary */}
                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Bill Details</h3>
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                         <div className="flex justify-between text-sm text-slate-600">
                            <span>Item Total</span>
                            <span>₹{cartTotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span className="flex items-center gap-1">Delivery Fee</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Platform Fee</span>
                            <span>₹{platformFee}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-700 font-medium">
                            <span className="flex items-center gap-1">Tree Contribution</span>
                            <span>₹{treeContribution}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>GST (5%)</span>
                            <span>₹{gst.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-slate-100 border-dashed my-2"></div>
                        <div className="flex justify-between items-center font-bold text-slate-900 text-lg">
                            <span>Grand Total</span>
                            <span>₹{grandTotal.toFixed(0)}</span>
                        </div>
                    </div>
                </section>

                 {/* 4. Trust Banner */}
                 <div className="flex items-center gap-2 justify-center text-slate-400 text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Safe and Secure Payments. 100% Authentic Products.</span>
                 </div>
            </div>

            {/* Sticky Pay Button */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-100 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
                <div className="max-w-2xl mx-auto">
                    <button 
                        onClick={handlePayment}
                        disabled={isProcessing}
                        className="w-full bg-red-500 text-white font-bold text-lg py-3 rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isProcessing ? 'Processing...' : `Pay ₹${grandTotal.toFixed(0)}`}
                    </button>
                </div>
            </div>

            {/* Address Modal */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end sm:justify-center items-end sm:items-center p-0 sm:p-4">
                    <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slideInUp sm:animate-fadeIn">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800">Add New Address</h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSaveAddress} className="p-5 overflow-y-auto max-h-[70vh]">
                            
                            {/* Detect Location Button */}
                            <button 
                                type="button"
                                onClick={handleDetectLocation}
                                disabled={isDetecting}
                                className="w-full mb-6 py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold flex items-center justify-center gap-2 border border-indigo-100 hover:bg-indigo-100 transition-colors"
                            >
                                {isDetecting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        Detecting Location...
                                    </>
                                ) : (
                                    <>
                                        <Crosshair className="w-4 h-4" />
                                        Use Current Location
                                    </>
                                )}
                            </button>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Tag as</label>
                                    <div className="flex gap-3">
                                        {['Home', 'Work', 'Other'].map(tag => (
                                            <button
                                                key={tag}
                                                type="button"
                                                onClick={() => setAddressForm(prev => ({ ...prev, tag }))}
                                                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                                                    addressForm.tag === tag 
                                                    ? 'bg-red-50 border-red-500 text-red-600' 
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                            >
                                                {tag === 'Home' && <Home className="w-4 h-4" />}
                                                {tag === 'Work' && <Briefcase className="w-4 h-4" />}
                                                {tag === 'Other' && <MapPin className="w-4 h-4" />}
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Flat / House No / Building</label>
                                    <input 
                                        type="text"
                                        name="street"
                                        value={addressForm.street}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 204, Galaxy Apartments"
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 placeholder:text-slate-300"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Area / Colony / Street</label>
                                    <input 
                                        type="text"
                                        name="area"
                                        value={addressForm.area}
                                        onChange={handleInputChange}
                                        placeholder="e.g. MG Road, Indiranagar"
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 placeholder:text-slate-300"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">City</label>
                                        <input 
                                            type="text"
                                            name="city"
                                            value={addressForm.city}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Bengaluru"
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">State</label>
                                        <input 
                                            type="text"
                                            name="state"
                                            value={addressForm.state}
                                            onChange={handleInputChange}
                                            placeholder="e.g. Karnataka"
                                            className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 placeholder:text-slate-300"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Pincode</label>
                                    <input 
                                        type="tel"
                                        name="zip"
                                        maxLength={6}
                                        value={addressForm.zip}
                                        onChange={handleInputChange}
                                        placeholder="e.g. 560038"
                                        className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 placeholder:text-slate-300"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <button 
                                    type="submit"
                                    className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};