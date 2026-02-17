import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, ShoppingBag, MapPin, Truck, Package, X, Receipt, ChevronRight, AlertCircle, ChefHat, Bike, Home, Download } from 'lucide-react';
import { Order, CartItem } from '../types';

export const Orders: React.FC = () => {
  const { orders } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-sm mx-4">
           <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <ShoppingBag className="w-8 h-8" />
           </div>
           <h2 className="text-xl font-bold text-slate-800 mb-2">Please Login</h2>
           <p className="text-slate-500 mb-6 text-sm">You need to be logged in to view your past orders.</p>
           <button onClick={() => navigate('/login')} className="w-full px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200">Login to Continue</button>
        </div>
      </div>
    );
  }

  const calculateItemTotal = (items: CartItem[]) => {
      return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateSavings = (items: CartItem[]) => {
      return items.reduce((sum, item) => {
          if (item.originalPrice && item.originalPrice > item.price) {
              return sum + ((item.originalPrice - item.price) * item.quantity);
          }
          return sum;
      }, 0);
  };

  const getOrderStatusStep = (status: string) => {
      switch(status) {
          case 'Processing': return 1; // Preparing
          case 'On the way': return 2; // Shipped/Out
          case 'Delivered': return 3;
          case 'Cancelled': return -1;
          default: return 0;
      }
  };

  const handleDownloadInvoice = (order: Order) => {
    const invoiceWindow = window.open('', '_blank');
    if (invoiceWindow) {
        invoiceWindow.document.write(`
            <html>
            <head>
                <title>Invoice #${order.id}</title>
                <style>
                    body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; border-bottom: 2px solid #f1f5f9; padding-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: 900; color: #ef4444; font-style: italic; display: flex; align-items: center; gap: 8px; }
                    .logo-icon { background: #ef4444; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; font-size: 20px; }
                    .invoice-title { text-align: right; }
                    .invoice-title h1 { margin: 0; font-size: 24px; color: #0f172a; }
                    .invoice-title p { margin: 4px 0 0; font-size: 14px; color: #64748b; }
                    .order-meta { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 40px; gap: 20px; }
                    .meta-group h3 { font-size: 12px; text-transform: uppercase; color: #94a3b8; letter-spacing: 0.05em; margin: 0 0 8px 0; }
                    .meta-group p { margin: 0; font-weight: 500; }
                    table { w-full; border-collapse: collapse; margin-bottom: 30px; width: 100%; }
                    th { text-align: left; padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #64748b; background: #f8fafc; }
                    td { padding: 16px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
                    .text-right { text-align: right; }
                    .item-name { font-weight: 500; color: #0f172a; }
                    .item-desc { font-size: 12px; color: #64748b; margin-top: 4px; }
                    .total-section { width: 300px; margin-left: auto; background: #f8fafc; padding: 20px; border-radius: 8px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #475569; }
                    .grand-total { font-weight: 700; font-size: 18px; border-top: 2px dashed #cbd5e1; padding-top: 12px; margin-top: 12px; color: #0f172a; }
                    .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 20px; }
                    .saving-pill { color: #16a34a; font-size: 11px; background: #dcfce7; padding: 2px 6px; border-radius: 4px; font-weight: 600; margin-left: 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="logo">
                        <div class="logo-icon">S</div>
                        Spirecart
                    </div>
                    <div class="invoice-title">
                        <h1>INVOICE</h1>
                        <p>#${order.id}</p>
                    </div>
                </div>
                
                <div class="order-meta">
                    <div class="meta-group">
                        <h3>Billed To</h3>
                        <p>Customer Name</p>
                        <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Spirecart Registered User</p>
                    </div>
                    <div class="meta-group" style="text-align: right;">
                        <h3>Order Details</h3>
                        <p>Date: ${order.date}</p>
                        <p>Status: ${order.status}</p>
                        <p>Payment: Online / UPI</p>
                    </div>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th style="width: 50%">Item Description</th>
                            <th class="text-right">Unit Price</th>
                            <th class="text-right">Qty</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td>
                                    <div class="item-name">
                                        ${item.name}
                                        ${item.originalPrice && item.originalPrice > item.price ? `<span class="saving-pill">Saved ₹${((item.originalPrice - item.price) * item.quantity).toFixed(0)}</span>` : ''}
                                    </div>
                                    <div class="item-desc">${item.seller || 'Spire Retail'}</div>
                                </td>
                                <td class="text-right">₹${item.price.toFixed(2)}</td>
                                <td class="text-right">${item.quantity}</td>
                                <td class="text-right">₹${(item.price * item.quantity).toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="total-section">
                    <div class="row"><span>Item Total</span> <span>₹${order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span></div>
                    <div class="row"><span>Delivery Fee</span> <span>₹${order.deliveryFee}</span></div>
                    <div class="row"><span>Platform Fee</span> <span>₹${order.platformFee}</span></div>
                    <div class="row"><span>Tree Contribution</span> <span>₹${order.treeContribution}</span></div>
                    <div class="row"><span>GST (5%)</span> <span>₹${order.gst.toFixed(2)}</span></div>
                    <div class="row grand-total"><span>Total Amount</span> <span>₹${order.total.toFixed(0)}</span></div>
                </div>

                <div class="footer">
                    <p>Thank you for shopping with Spirecart!</p>
                    <p>Registered Office: Spire Tech Park, Bengaluru, Karnataka, India - 560001</p>
                    <p>This is a computer generated invoice and does not require a signature.</p>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `);
        invoiceWindow.document.close();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
           <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Your Orders</h1>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
         {orders.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 opacity-60">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-lg font-bold text-slate-700">No past orders found</p>
              <p className="text-sm text-slate-500 mb-6">Looks like you haven't ordered anything yet.</p>
              <button onClick={() => navigate('/')} className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Start Shopping</button>
           </div>
         ) : (
           orders.map((order) => {
             const currentStep = getOrderStatusStep(order.status);
             
             return (
             <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Order Header */}
                <div className="flex justify-between items-start p-4 border-b border-slate-50">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-slate-800 line-clamp-1">{order.items[0].restaurantName || order.items[0].seller || 'Spirecart Store'}</span>
                        {order.items.length > 1 && <span className="text-xs text-slate-400 font-medium">+{order.items.length - 1} items</span>}
                      </div>
                      <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 ${
                              order.status === 'Delivered' ? 'bg-slate-100 text-slate-600' : 
                              order.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                              'bg-green-50 text-green-600 animate-pulse'
                          }`}>
                             {order.status === 'Delivered' ? <CheckCircle className="w-3 h-3" /> : 
                              order.status === 'Cancelled' ? <X className="w-3 h-3" /> :
                              <Clock className="w-3 h-3" /> 
                             }
                             {order.status}
                          </span>
                          <span className="text-[10px] text-slate-400">• {order.date}</span>
                      </div>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="font-bold text-slate-900 text-lg">₹{order.total.toFixed(0)}</span>
                   </div>
                </div>
                
                {/* Visual Progress Bar for Active Orders */}
                {(order.status === 'Processing' || order.status === 'On the way') && (
                    <div className="px-4 pt-4 pb-0">
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
                            <div className={`h-full ${order.status === 'On the way' ? 'w-3/4' : 'w-1/4'} bg-green-500 transition-all duration-1000`}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                            <span>Placed</span>
                            <span className={order.status === 'Processing' ? 'text-green-600 font-bold' : ''}>Processing</span>
                            <span className={order.status === 'On the way' ? 'text-green-600 font-bold' : ''}>On the way</span>
                            <span>Delivered</span>
                        </div>
                    </div>
                )}
                
                {/* Item Summary */}
                <div className="p-4 bg-slate-50/50 mt-2 rounded-lg mx-4 mb-4">
                   <p className="text-sm text-slate-600 line-clamp-1">
                       {order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                   </p>
                </div>
                
                {/* Actions */}
                <div className="p-3 flex items-center justify-between gap-3 bg-white border-t border-slate-50">
                   <div className="flex -space-x-2 overflow-hidden pl-1">
                     {order.items.slice(0,3).map((item, idx) => (
                       <img key={idx} src={item.image} alt="item" className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover bg-white" />
                     ))}
                   </div>
                   
                   <div className="flex gap-2">
                        <button 
                             onClick={() => setSelectedOrder(order)}
                             className="px-4 py-2 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            View Details
                        </button>
                       {/* Track Order Button if Active */}
                       {(order.status === 'On the way' || order.status === 'Processing') && (
                           <button 
                             onClick={() => navigate(`/track-order/${order.id}`)}
                             className="px-4 py-2 bg-red-50 text-red-600 text-xs sm:text-sm font-bold rounded-lg hover:bg-red-100 transition-colors border border-red-100 flex items-center gap-1 animate-pulse"
                           >
                              <MapPin className="w-3.5 h-3.5" /> Track Live
                           </button>
                       )}
                       
                       <button className="px-4 py-2 bg-slate-900 text-white text-xs sm:text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                         Reorder
                       </button>
                   </div>
                </div>
             </div>
           )})
         )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <div>
                          <h3 className="font-bold text-lg text-slate-800">Order Summary</h3>
                          <p className="text-xs text-slate-500 font-mono">ID: {selectedOrder.id}</p>
                      </div>
                      <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>

                  {/* Scrollable Content */}
                  <div className="overflow-y-auto p-4 flex-1">
                      
                      {/* Tracking Stepper */}
                      <div className="mb-6 px-2">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Order Status</h4>
                          <div className="relative flex justify-between items-center z-10">
                              {[
                                  { label: 'Placed', icon: Receipt },
                                  { label: 'Processing', icon: ChefHat },
                                  { label: 'On Way', icon: Bike },
                                  { label: 'Delivered', icon: Home }
                              ].map((step, idx) => {
                                  const currentStepIdx = getOrderStatusStep(selectedOrder.status);
                                  const isCompleted = idx <= currentStepIdx;
                                  const isCurrent = idx === currentStepIdx;
                                  
                                  return (
                                      <div key={idx} className="flex flex-col items-center gap-2">
                                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                                              isCompleted ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-300'
                                          }`}>
                                              {isCompleted ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                                          </div>
                                          <span className={`text-[10px] font-bold ${isCompleted ? 'text-slate-800' : 'text-slate-300'}`}>{step.label}</span>
                                      </div>
                                  );
                              })}
                              {/* Connecting Line */}
                              <div className="absolute top-4 left-0 w-full h-0.5 bg-slate-100 -z-10">
                                  <div 
                                    className="h-full bg-green-500 transition-all duration-500" 
                                    style={{ width: `${(getOrderStatusStep(selectedOrder.status) / 3) * 100}%` }}
                                  ></div>
                              </div>
                          </div>
                      </div>

                      {/* Status Banner */}
                      <div className={`flex items-center gap-3 p-3 border rounded-xl mb-6 ${
                          selectedOrder.status === 'Cancelled' ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
                      }`}>
                           <div className="p-2 bg-white rounded-full">
                               {selectedOrder.status === 'Delivered' ? <CheckCircle className="w-5 h-5 text-green-500" /> : 
                                selectedOrder.status === 'Cancelled' ? <X className="w-5 h-5 text-red-500" /> :
                                <Clock className="w-5 h-5 text-blue-500" />
                               }
                           </div>
                           <div>
                               <p className="text-sm font-bold text-slate-800">{selectedOrder.status}</p>
                               <p className="text-xs text-slate-500">{selectedOrder.date}</p>
                           </div>
                           {(selectedOrder.status === 'On the way' || selectedOrder.status === 'Processing') && (
                               <button 
                                 onClick={() => { setSelectedOrder(null); navigate(`/track-order/${selectedOrder.id}`); }}
                                 className="ml-auto text-xs font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm text-blue-600"
                               >
                                   Track
                               </button>
                           )}
                      </div>

                      {/* Items List Breakdown */}
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Items Purchased</h4>
                      <div className="bg-slate-50 rounded-xl p-3 mb-6 space-y-3 border border-slate-100">
                          {selectedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex gap-3 bg-white p-2 rounded-lg shadow-sm border border-slate-50">
                                  <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                                      <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                  </div>
                                  <div className="flex-1">
                                      <p className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mb-1">{item.name}</p>
                                      
                                      <div className="flex justify-between items-end">
                                          <div className="text-xs text-slate-500">
                                              <span className="font-medium">{item.quantity}</span> x ₹{item.price}
                                          </div>
                                          <div className="text-right">
                                              <span className="font-bold text-sm text-slate-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                                              {item.originalPrice && item.originalPrice > item.price && (
                                                  <div className="text-[10px] text-green-600 font-bold bg-green-50 px-1 rounded inline-block ml-1">
                                                      Saved ₹{((item.originalPrice - item.price) * item.quantity).toFixed(0)}
                                                  </div>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                      {/* Bill Breakdown */}
                      <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                              <Receipt className="w-3 h-3" /> Bill Details
                          </h4>
                          <div className="space-y-2 text-sm">
                              <div className="flex justify-between text-slate-600">
                                  <span>Item Total</span>
                                  <span>₹{calculateItemTotal(selectedOrder.items).toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                  <span>Delivery Fee</span>
                                  <span>{selectedOrder.deliveryFee === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${selectedOrder.deliveryFee}`}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                  <span>Platform Fee</span>
                                  <span>₹{selectedOrder.platformFee}</span>
                              </div>
                              <div className="flex justify-between text-slate-600">
                                  <span>GST & Taxes (5%)</span>
                                  <span>₹{selectedOrder.gst.toFixed(2)}</span>
                              </div>
                              {selectedOrder.treeContribution > 0 && (
                                <div className="flex justify-between text-green-700 font-medium">
                                    <span>Tree Contribution</span>
                                    <span>₹{selectedOrder.treeContribution}</span>
                                </div>
                              )}
                              
                              {/* Savings Display */}
                              {calculateSavings(selectedOrder.items) > 0 && (
                                  <div className="flex justify-between text-green-600 font-bold border-t border-dashed border-slate-200 pt-2">
                                      <span>Total Savings</span>
                                      <span>- ₹{calculateSavings(selectedOrder.items).toFixed(0)}</span>
                                  </div>
                              )}

                              <div className="flex justify-between items-center text-slate-900 font-black text-lg pt-3 border-t border-slate-200 mt-2">
                                  <span>Grand Total</span>
                                  <span>₹{selectedOrder.total.toFixed(0)}</span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                      <button 
                        onClick={() => handleDownloadInvoice(selectedOrder)}
                        className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-white transition-colors flex items-center justify-center gap-2"
                      >
                          <Download className="w-4 h-4" /> Invoice
                      </button>
                      <button className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200">
                          Repeat Order
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};