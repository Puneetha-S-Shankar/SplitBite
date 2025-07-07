import React from 'react';
import { Receipt, Info } from 'lucide-react';

const TaxInput = ({ taxAmount, onTaxChange }) => {
  return (
    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-amber-100 shadow-lg">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg shadow-md">
          <Receipt className="text-white" size={24} />
        </div>
        <span className="bg-gradient-to-r from-amber-700 to-yellow-700 bg-clip-text text-transparent">
          Tax & Service Charges
        </span>
      </h2>
      
      <div className="space-y-4">
        <input
          type="number"
          value={taxAmount}
          onChange={(e) => onTaxChange(e.target.value)}
          placeholder="Enter tax amount"
          step="0.01"
          min="0"
          className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-white/70 backdrop-blur-sm shadow-sm transition-all duration-300 placeholder-amber-600/60"
        />
        
        <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-4 border border-amber-200">
          <div className="flex items-start gap-3">
            <div className="p-1 bg-amber-500 rounded-full mt-0.5">
              <Info className="text-white" size={16} />
            </div>
            <div>
              <p className="text-amber-800 font-medium mb-1">
                Tax and service charges will be split equally among all people
              </p>
              {taxAmount && parseFloat(taxAmount) > 0 && (
                <p className="text-amber-700 font-semibold">
                  Current tax: ₹{parseFloat(taxAmount).toFixed(2)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxInput;