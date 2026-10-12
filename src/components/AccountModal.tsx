import React, { useState } from 'react';
import { X, User, MapPin, Package, Heart, LogOut, Check, Edit2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const AccountModal: React.FC = () => {
  const {
    isAccountModalOpen,
    setIsAccountModalOpen,
    userProfile,
    updateUserProfile,
    orders,
    wishlist,
    navigateTo,
    showToast,
  } = useShop();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [newAddress, setNewAddress] = useState('');

  if (!isAccountModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setIsEditing(false);
  };

  const handleAddAddress = () => {
    if (!newAddress.trim()) return;
    updateUserProfile({
      savedAddresses: [...userProfile.savedAddresses, newAddress.trim()],
      selectedAddress: newAddress.trim(),
    });
    setNewAddress('');
  };

  const handleSelectAddress = (addr: string) => {
    updateUserProfile({ selectedAddress: addr });
    showToast('Default delivery address updated');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={() => setIsAccountModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#172554] text-amber-400 flex items-center justify-center font-black">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 leading-tight">My Account & Profile</h2>
              <p className="text-xs text-slate-500">{userProfile.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAccountModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Links Row */}
        <div className="grid grid-cols-2 gap-3 my-5">
          <button
            type="button"
            onClick={() => {
              setIsAccountModalOpen(false);
              navigateTo('orders');
            }}
            className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left"
          >
            <Package className="w-5 h-5 text-amber-500" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">My Orders</span>
              <span className="text-slate-500">{orders.length} placed</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsAccountModalOpen(false);
              navigateTo('wishlist');
            }}
            className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 flex items-center gap-3 transition-colors text-left"
          >
            <Heart className="w-5 h-5 text-rose-500" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 block">Wishlist</span>
              <span className="text-slate-500">{wishlist.length} items</span>
            </div>
          </button>
        </div>

        {/* Profile Details Form */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              Personal Information
            </h3>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-bold text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>
              <div>
                <label className="font-bold text-slate-600 block mb-1">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#172554] text-white font-bold cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div>
                <span className="text-slate-400 font-medium">Name: </span>
                <strong className="text-slate-900">{userProfile.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Email: </span>
                <strong className="text-slate-900">{userProfile.email}</strong>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Phone: </span>
                <strong className="text-slate-900">{userProfile.phone}</strong>
              </div>
            </div>
          )}

          {/* Saved Addresses Section */}
          <div className="pt-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 mb-2">
              Saved Delivery Addresses
            </h3>
            <div className="space-y-2 text-xs">
              {userProfile.savedAddresses.map((addr, idx) => {
                const isSelected = userProfile.selectedAddress === addr;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'border-[#172554] bg-blue-50/60 font-bold text-slate-900'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="truncate pr-2">{addr}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-800 shrink-0" />}
                  </div>
                );
              })}
            </div>

            {/* Add new address */}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Add new flat, street, pincode..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 outline-none"
              />
              <button
                type="button"
                onClick={handleAddAddress}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
          <span className="text-slate-400">MegaMart Account Status: Active</span>
          <button
            type="button"
            onClick={() => {
              showToast('Logged out of demo session');
              setIsAccountModalOpen(false);
            }}
            className="text-rose-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
