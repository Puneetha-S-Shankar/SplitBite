import React from 'react';
import { TrendingUp, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

const ResultDisplay = ({ personTotals, totalBill, taxAmount }) => {
  const totalPaid = Object.values(personTotals).reduce((sum, amount) => sum + amount, 0);
  
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 shadow-xl">
      <h2 className="text-3xl font-bold text-amber-900 mb-8 flex items-center gap-3">
        <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-lg">
          <TrendingUp className="text-white" size={28} />
        </div>
        <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
          Bill Summary
        </span>
      </h2>
      
      {/* Bill Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
              <DollarSign className="text-white" size={20} />
            </div>
            <span className="font-bold text-amber-800">Total Bill</span>
          </div>
          <p className="text-3xl font-bold text-amber-900">
            ₹{totalBill.toFixed(2)}
          </p>
        </div>
        
        {taxAmount > 0 && (
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg">
                <DollarSign className="text-white" size={20} />
              </div>
              <span className="font-bold text-orange-800">Tax/Service</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">
              ₹{taxAmount.toFixed(2)}
            </p>
          </div>
        )}
        
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-amber-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${
              Math.abs(totalPaid - totalBill) < 0.01 
                ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                : 'bg-gradient-to-br from-red-400 to-pink-500'
            }`}>
              {Math.abs(totalPaid - totalBill) < 0.01 ? (
                <CheckCircle className="text-white" size={20} />
              ) : (
                <AlertCircle className="text-white" size={20} />
              )}
            </div>
            <span className="font-bold text-amber-800">Verification</span>
          </div>
          <p className={`text-xl font-bold ${
            Math.abs(totalPaid - totalBill) < 0.01 ? 'text-green-600' : 'text-red-600'
          }`}>
            {Math.abs(totalPaid - totalBill) < 0.01 ? '✓ Correct' : '✗ Error'}
          </p>
        </div>
      </div>

      {/* Individual Amounts */}
      <div className="border-t-2 border-amber-200 pt-6">
        <h3 className="font-bold text-amber-900 mb-6 text-2xl">
          Amount each person should pay:
        </h3>
        
        <div className="space-y-4">
          {Object.entries(personTotals)
            .sort(([,a], [,b]) => b - a) // Sort by amount descending
            .map(([person, amount], index) => (
            <div key={person} className="flex justify-between items-center bg-white/80 backdrop-blur-sm px-6 py-4 rounded-xl border-2 border-amber-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                  index === 0 ? 'bg-gradient-to-br from-amber-500 to-orange-500' : 
                  index === 1 ? 'bg-gradient-to-br from-orange-400 to-red-400' : 
                  'bg-gradient-to-br from-yellow-400 to-amber-400'
                }`}>
                  {index + 1}
                </div>
                <span className="font-bold text-amber-900 text-xl">{person}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-amber-800 text-2xl">
                  ₹{amount.toFixed(2)}
                </span>
                <div className="text-sm text-amber-600 font-medium">
                  {((amount / totalBill) * 100).toFixed(1)}% of total
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-8 pt-6 border-t-2 border-amber-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-600 font-medium">People</p>
            <p className="text-xl font-bold text-amber-900">
              {Object.keys(personTotals).length}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-600 font-medium">Average</p>
            <p className="text-xl font-bold text-amber-900">
              ₹{(totalBill / Object.keys(personTotals).length).toFixed(2)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-600 font-medium">Highest</p>
            <p className="text-xl font-bold text-amber-900">
              ₹{Math.max(...Object.values(personTotals)).toFixed(2)}
            </p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-600 font-medium">Lowest</p>
            <p className="text-xl font-bold text-amber-900">
              ₹{Math.min(...Object.values(personTotals)).toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;