import React, { useState } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PincodeModal: React.FC = () => {
  const { isPincodeModalOpen, setIsPincodeModalOpen, userProfile, updateUserProfile, showToast } = useShop();

  const [addressInput, setAddressInput] = useState(userProfile.selectedAddress);

  const presets = [
    'Flat 402, Green Glen Heights, Indiranagar, Bengaluru - 560038',
    'Tech Park Campus, Tower B, Bellandur, Bengaluru - 560103',
    'House 18, 5th Cross, Koramangala 4th Block, Bengaluru - 560034',
    'Tower 4, DLF Cyber City, Phase 2, Gurugram - 122002',
    'B-104, Hiranandani Gardens, Powai, Mumbai - 400076',
  ];

  if (!isPincodeModalOpen) return null;

  const handleSave = () => {
    if (addressInput.trim()) {
      updateUserProfile({ selectedAddress: addressInput.trim() });
      setIsPincodeModalOpen(false);
      showToast('Delivery hub updated successfully');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      onClick={() => setIsPincodeModalOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 p-6 text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-black text-sm text-slate-900 uppercase tracking-wider">
              Choose Delivery Location
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setIsPincodeModalOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3 leading-relaxed">
          Delivery options, live stock availability, and express speeds vary by location.
        </p>

        <div className="mt-3">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Current Delivery Address
          </label>
          <textarea
            rows={2}
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:border-[#172554] bg-slate-50 outline-none"
            placeholder="Enter street address, building, city, and 6-digit pin..."
          />
        </div>

        <div className="mt-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Select City Hubs
          </span>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setAddressInput(preset)}
                className={`w-full p-2.5 rounded-xl border text-left text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  addressInput === preset
                    ? 'border-[#172554] bg-blue-50/70 font-bold text-slate-900'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                <span className="truncate pr-2">{preset}</span>
                {addressInput === preset && <Check className="w-3.5 h-3.5 text-blue-800 shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsPincodeModalOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors cursor-pointer"
          >
            Apply Location
          </button>
        </div>
      </div>
    </div>
  );
};
