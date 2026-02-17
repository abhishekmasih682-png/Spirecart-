import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';
import { ArrowLeft, Plus, MapPin, Briefcase, Home, MoreVertical, Trash2, Edit2, Check, X, Crosshair } from 'lucide-react';

export const AddressBook: React.FC = () => {
  const navigate = useNavigate();
  const { savedAddresses, addAddress, editAddress, deleteAddress, setDefaultAddress, isAuthenticated, detectLocation } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Form State
  const initialFormState = {
    tag: 'Home' as 'Home' | 'Work' | 'Other',
    street: '',
    area: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  };
  const [formData, setFormData] = useState(initialFormState);

  // Redirect if not logged in
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleOpenModal = (address?: Address) => {
    if (address) {
        setEditingId(address.id);
        setFormData({
            tag: address.tag,
            street: address.street,
            area: address.area,
            city: address.city,
            state: address.state,
            zip: address.zip,
            isDefault: address.isDefault
        });
    } else {
        setEditingId(null);
        setFormData(initialFormState);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        editAddress(editingId, formData);
    } else {
        addAddress(formData);
    }
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    const location = await detectLocation();
    setIsDetecting(false);
    if (location) {
        setFormData(prev => ({
            ...prev,
            street: location.street,
            area: location.area,
            city: location.city,
            state: location.state,
            zip: location.zip
        }));
    }
  };

  const getTagIcon = (tag: string) => {
      switch(tag) {
          case 'Home': return <Home className="w-4 h-4" />;
          case 'Work': return <Briefcase className="w-4 h-4" />;
          default: return <MapPin className="w-4 h-4" />;
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 px-4 py-3 flex items-center gap-3 border-b border-slate-100 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
           <ArrowLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-lg font-bold text-slate-800">Manage Addresses</h1>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
         {savedAddresses.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                 <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                     <MapPin className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="text-lg font-bold text-slate-700">No Addresses Saved</p>
                 <p className="text-sm text-slate-500">Add an address to make checkout faster.</p>
             </div>
         ) : (
             savedAddresses.map((addr) => (
                 <div key={addr.id} className={`bg-white rounded-xl border p-4 shadow-sm relative group transition-all ${addr.isDefault ? 'border-red-200 bg-red-50/10' : 'border-slate-200 hover:border-slate-300'}`}>
                     <div className="flex items-start justify-between mb-2">
                         <div className="flex items-center gap-2">
                             <div className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 uppercase ${addr.tag === 'Home' ? 'bg-indigo-50 text-indigo-600' : addr.tag === 'Work' ? 'bg-orange-50 text-orange-600' : 'bg-slate-100 text-slate-600'}`}>
                                 {getTagIcon(addr.tag)} {addr.tag}
                             </div>
                             {addr.isDefault && (
                                 <span className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full border border-green-200">DEFAULT</span>
                             )}
                         </div>
                         <div className="flex items-center gap-2">
                             <button 
                                onClick={() => handleOpenModal(addr)} 
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 transition-colors"
                             >
                                 <Edit2 className="w-4 h-4" />
                             </button>
                             <button 
                                onClick={() => {
                                    if(confirm('Are you sure you want to delete this address?')) {
                                        deleteAddress(addr.id);
                                    }
                                }}
                                className="p-2 hover:bg-red-50 rounded-full text-slate-500 hover:text-red-600 transition-colors"
                             >
                                 <Trash2 className="w-4 h-4" />
                             </button>
                         </div>
                     </div>
                     
                     <p className="text-slate-800 text-sm font-medium leading-relaxed pr-8">
                         {addr.street}, {addr.area}
                     </p>
                     <p className="text-slate-500 text-sm mb-4">
                         {addr.city}, {addr.state} - {addr.zip}
                     </p>

                     {!addr.isDefault && (
                         <button 
                            onClick={() => setDefaultAddress(addr.id)}
                            className="text-xs font-bold text-red-500 hover:text-red-600 hover:underline flex items-center gap-1"
                         >
                            Set as Default
                         </button>
                     )}
                 </div>
             ))
         )}
      </div>

      {/* Floating Add Button */}
      <div className="fixed bottom-6 right-6 z-20">
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-red-200 transition-transform active:scale-95"
          >
              <Plus className="w-5 h-5" /> Add New Address
          </button>
      </div>

      {/* Address Modal */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end sm:justify-center items-end sm:items-center p-0 sm:p-4 animate-fadeIn">
              <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slideInUp sm:animate-fadeIn">
                  <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="font-bold text-lg text-slate-800">{editingId ? 'Edit Address' : 'Add New Address'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="p-5 overflow-y-auto max-h-[75vh]">
                      
                      {/* Detect Location Button */}
                      {!editingId && (
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
                      )}

                      <div className="space-y-4">
                          <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-500 uppercase">Tag as</label>
                              <div className="flex gap-3">
                                  {['Home', 'Work', 'Other'].map(tag => (
                                      <button
                                          key={tag}
                                          type="button"
                                          onClick={() => setFormData(prev => ({ ...prev, tag: tag as any }))}
                                          className={`flex-1 py-2 px-3 rounded-lg border text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                                              formData.tag === tag 
                                              ? 'bg-red-50 border-red-500 text-red-600' 
                                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                          }`}
                                      >
                                          {getTagIcon(tag)}
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
                                  value={formData.street}
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
                                  value={formData.area}
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
                                      value={formData.city}
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
                                      value={formData.state}
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
                                  value={formData.zip}
                                  onChange={handleInputChange}
                                  placeholder="e.g. 560038"
                                  className="w-full p-3 border border-slate-200 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 placeholder:text-slate-300"
                                  required
                              />
                          </div>

                          {!formData.isDefault && (
                             <div className="flex items-center gap-3 pt-2">
                                <input 
                                   type="checkbox" 
                                   id="isDefault" 
                                   name="isDefault"
                                   checked={formData.isDefault}
                                   onChange={handleInputChange}
                                   className="w-5 h-5 text-red-500 rounded focus:ring-red-500 border-gray-300"
                                />
                                <label htmlFor="isDefault" className="text-sm font-medium text-slate-700">Set as default address</label>
                             </div>
                          )}
                      </div>
                      
                      <div className="mt-6">
                          <button 
                              type="submit"
                              className="w-full bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
                          >
                              {editingId ? 'Update Address' : 'Save Address'}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};