import React from 'react';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';

const DishAssignmentForm = ({ dishes, people, onToggleConsumer }) => {
  if (dishes.length === 0 || people.length === 0) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 mb-8 border border-yellow-100 shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-md">
            <Users className="text-white" size={24} />
          </div>
          <span className="bg-gradient-to-r from-yellow-700 to-amber-700 bg-clip-text text-transparent">
            Who ate what?
          </span>
        </h2>
        <div className="text-center py-8">
          <div className="text-yellow-400 mb-2">
            <Users size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-yellow-600/70 italic font-medium">
            Please add both people and dishes to start assigning
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl p-6 mb-8 border border-yellow-100 shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-lg shadow-md">
          <Users className="text-white" size={24} />
        </div>
        <span className="bg-gradient-to-r from-yellow-700 to-amber-700 bg-clip-text text-transparent">
          Who ate what?
        </span>
      </h2>
      <p className="text-yellow-700 mb-6 font-medium">
        For each dish, select who ate it:
      </p>
      <div className="space-y-6">
        {dishes.map((dish) => (
          <div key={dish.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-yellow-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="mb-4">
              <h3 className="font-bold text-yellow-900 text-xl mb-2">
                {dish.name}
              </h3>
              <p className="text-yellow-600 font-semibold text-lg">
                ₹{dish.cost.toFixed(2)}
              </p>
            </div>
            <form className="flex flex-wrap gap-4 mb-4 items-center">
              {people.map((person) => {
                const checked = dish.consumers.includes(person);
                return (
                  <label
                    key={person}
                    className={`flex items-center gap-2 cursor-pointer select-none px-4 py-2 rounded-full border-2 transition-all duration-300 shadow-sm text-base font-semibold
                      ${checked ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-500 shadow-lg' : 'bg-white/80 border-yellow-200 text-yellow-900 hover:bg-yellow-100'}
                    `}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleConsumer(dish.id, person)}
                      className="w-6 h-6 rounded-full accent-amber-500 border-2 border-amber-300 focus:ring-2 focus:ring-amber-400 transition-all duration-300 shadow-sm"
                    />
                    <span>{person}</span>
                  </label>
                );
              })}
            </form>
            {dish.consumers.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="text-yellow-600" size={20} />
                  <p className="text-yellow-800 font-semibold">Consumers</p>
                </div>
                <p className="text-yellow-700 mb-2">
                  {dish.consumers.join(', ')}
                </p>
                <p className="text-yellow-600 font-medium">
                  Cost per person: ₹{(dish.cost / dish.consumers.length).toFixed(2)}
                </p>
              </div>
            )}
            {dish.consumers.length === 0 && (
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-4 border border-orange-200">
                <div className="flex items-center gap-2">
                  <AlertCircle className="text-orange-600" size={20} />
                  <p className="text-orange-800 font-semibold">
                    No one assigned to this dish yet
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishAssignmentForm;