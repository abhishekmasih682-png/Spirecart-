import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Phone, MessageSquare, MapPin, Bike, CheckCircle2, Clock, Home, Star, ShieldCheck, Navigation } from 'lucide-react';

export const OrderTracking: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders } = useCart();
  const [activeStep, setActiveStep] = useState(1);

  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    if (order) {
        // Simulate progress based on order status for the demo
        if (order.status === 'Delivered') setActiveStep(4);
        else if (order.status === 'On the way') setActiveStep(3);
        else if (order.status === 'Processing') setActiveStep(2);
        else setActiveStep(1);
    }
  }, [order]);

  if (!order) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <p className="mb-4">Order not found</p>
        <button onClick={() => navigate('/orders')} className="text-red-500 font-bold">Go to Orders</button>
    </div>
  );

  const steps = [
    { label: 'Order Placed', time: order.date.split(', ')[1] || '10:00 AM' },
    { label: 'Preparing', time: '10:05 AM' },
    { label: 'On the way', time: '10:20 AM' },
    { label: 'Delivered', time: 'Soon' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Map Background Simulation */}
        <div className="h-[50vh] w-full bg-[#E5E3DF] relative">
             {/* Map Tiles / Pattern */}
             <div className="absolute inset-0 opacity-40" style={{
                 backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #d4d4d4 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #d4d4d4 20px)',
                 backgroundSize: '20px 20px'
             }}></div>
             
             {/* Abstract Map Roads */}
             <div className="absolute top-0 left-1/3 w-8 h-full bg-white/60 transform -skew-x-12"></div>
             <div className="absolute top-1/2 left-0 w-full h-6 bg-white/60 transform -rotate-12"></div>
             
             {/* Header */}
             <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10">
                <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-full shadow-lg hover:bg-slate-50 text-slate-700 active:scale-95 transition-transform">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-white/50">
                    <span className="text-xs font-bold text-slate-700">Order #{order.id.slice(-6)}</span>
                </div>
                <button className="p-2.5 bg-white rounded-full shadow-lg hover:bg-slate-50 text-slate-700">
                    <Navigation className="w-5 h-5" />
                </button>
             </div>

             {/* Driver Marker */}
             <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-pulse">
                 <div className="w-14 h-14 bg-white rounded-full p-1.5 shadow-2xl border-4 border-slate-900 relative z-10">
                     <div className="w-full h-full bg-green-50 rounded-full flex items-center justify-center">
                        <Bike className="w-6 h-6 text-green-600 fill-current" />
                     </div>
                 </div>
                 <div className="bg-slate-900 text-white text-[10px] px-3 py-1 rounded-full mt-2 font-bold shadow-lg">
                    12 mins away
                 </div>
                 {/* Map Pin Shadow */}
                 <div className="w-4 h-1 bg-black/20 rounded-full blur-[2px] mt-1"></div>
             </div>

             {/* Destination Marker */}
             <div className="absolute bottom-1/3 right-1/4 flex flex-col items-center opacity-80">
                 <MapPin className="w-10 h-10 text-red-500 fill-current drop-shadow-lg" />
                 <div className="w-4 h-1 bg-black/20 rounded-full blur-[2px]"></div>
             </div>
        </div>

        {/* Bottom Sheet */}
        <div className="bg-white absolute bottom-0 left-0 w-full rounded-t-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] min-h-[55vh] max-h-[80vh] overflow-y-auto animate-slideInUp">
            {/* Handle Bar */}
            <div className="sticky top-0 bg-white pt-3 pb-2 z-20 flex justify-center rounded-t-[2rem]">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
            </div>

            <div className="px-6 pb-8">
                {/* Time Estimate */}
                <div className="flex items-start justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 mb-1 leading-tight">
                            {order.status === 'Delivered' ? 'Order Delivered' : 'Arriving in 12 mins'}
                        </h2>
                        {order.status !== 'Delivered' && (
                            <p className="text-sm text-slate-500 font-medium">On time • Arriving by 10:45 AM</p>
                        )}
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                        {order.status === 'Delivered' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 relative">
                    <div className="relative flex justify-between items-start z-10">
                        {steps.map((step, idx) => {
                            const stepNum = idx + 1;
                            const isActive = stepNum <= activeStep;
                            const isCompleted = stepNum < activeStep;
                            
                            return (
                                <div key={stepNum} className="flex flex-col items-center gap-2 w-16">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 ${
                                        isActive 
                                        ? 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-200 scale-110' 
                                        : 'bg-white border-slate-200 text-slate-300'
                                    }`}>
                                        {isActive ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                                    </div>
                                    <div className="text-center">
                                        <p className={`text-[10px] font-bold leading-tight ${isActive ? 'text-slate-800' : 'text-slate-300'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-[9px] text-slate-400 mt-0.5">{step.time}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* Connecting Line */}
                    <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-0 rounded-full px-8 box-border">
                        <div 
                           className="h-full bg-green-500 transition-all duration-1000 ease-out"
                           style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Delivery Partner */}
                {order.status !== 'Processing' && (
                    <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 shadow-sm ring-1 ring-slate-100/50">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-md">
                                <img src="https://img.freepik.com/free-photo/portrait-young-indian-top-manager-t-shirt-tie-crossed-arms-smiling-white-isolated-wall_496169-1513.jpg?w=100" className="w-full h-full object-cover" alt="Ramesh" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-base">Ramesh Kumar</h3>
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                    <span>Delivery Partner</span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                    <span className="flex items-center text-green-600 font-bold">
                                        <ShieldCheck className="w-3 h-3 mr-0.5" /> Vaccinated
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-bold">
                                    4.8 <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                                <span className="text-[10px] text-slate-400">1200+ deliveries</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-red-600 transition-colors shadow-lg shadow-red-200">
                                <Phone className="w-4 h-4" /> Call
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 bg-slate-50 text-slate-700 py-3 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors border border-slate-200">
                                <MessageSquare className="w-4 h-4" /> Message
                            </button>
                        </div>
                    </div>
                )}
                
                {/* Order Summary Preview */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Order Items</h4>
                        <span className="text-xs font-bold text-slate-800 bg-white px-2 py-1 rounded border border-slate-200">
                            {order.items.length} Items
                        </span>
                    </div>
                    <div className="space-y-2">
                        {order.items.map((item) => (
                            <div key={item.cartItemId} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-5 h-5 bg-slate-200 rounded text-[10px] font-bold flex items-center justify-center text-slate-600">
                                        {item.quantity}x
                                    </span>
                                    <span className="text-slate-700 font-medium line-clamp-1">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-900">₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-dashed border-slate-300 mt-3 pt-3 flex justify-between items-center font-bold">
                        <span className="text-slate-600">Total Bill</span>
                        <span className="text-xl text-slate-900">₹{order.total.toFixed(0)}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};