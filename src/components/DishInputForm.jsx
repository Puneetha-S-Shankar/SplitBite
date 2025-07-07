import React, { useState } from 'react';
import { Plus, Trash2, UtensilsCrossed } from 'lucide-react';

const DishInputForm = ({ dishes, onAddDish, onRemoveDish }) => {
  const [dishInput, setDishInput] = useState({ name: '', cost: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dishInput.name.trim() && dishInput.cost.trim()) {
      onAddDish(dishInput.name, dishInput.cost);
      setDishInput({ name: '', cost: '' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 mb-8 border border-orange-100 shadow-lg">
      <h2 className="text-2xl font-bold text-orange-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg shadow-md">
          <UtensilsCrossed className="text-white" size={24} />
        </div>
        <span className="bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
          What and all did you guys eat
        </span>
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={dishInput.name}
          onChange={(e) => setDishInput({ ...dishInput, name: e.target.value })}
          placeholder="Dish name"
          className="flex-1 px-5 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 placeholder-orange-600/60 text-lg"
        />
        <input
          type="number"
          value={dishInput.cost}
          onChange={(e) => setDishInput({ ...dishInput, cost: e.target.value })}
          placeholder="Cost"
          step="0.01"
          min="0"
          className="w-32 px-5 py-3 border-2 border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 placeholder-orange-600/60 text-lg"
        />
        <button
          type="submit"
          className="px-7 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg transform hover:scale-105 active:scale-95 text-lg"
        >
          <Plus size={22} />
          Add Dish
        </button>
      </form>

      <div className="space-y-4">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-orange-200 flex items-center justify-between shadow-md hover:shadow-lg transition-all duration-300 group">
            <div>
              <h3 className="font-bold text-orange-900 text-lg">
                {dish.name}
              </h3>
              <p className="text-orange-600 font-semibold text-lg">
                ₹{dish.cost.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => onRemoveDish(dish.id)}
              className="text-orange-600 hover:text-red-500 transition-colors duration-300 p-2 rounded-full hover:bg-red-50 group-hover:scale-110"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      
      {dishes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-orange-400 mb-2">
            <UtensilsCrossed size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-orange-600/70 italic font-medium">No dishes added yet</p>
          <p className="text-orange-500/50 text-sm mt-1">Add dishes to split the bill</p>
        </div>
      )}
    </div>
  );
};

export default DishInputForm;