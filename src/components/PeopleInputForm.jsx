import React, { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

const PeopleInputForm = ({ people, onAddPerson, onRemovePerson }) => {
  const [personInput, setPersonInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (personInput.trim()) {
      onAddPerson(personInput);
      setPersonInput('');
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border border-amber-100 shadow-lg">
      <h2 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg shadow-md">
          <Users className="text-white" size={24} />
        </div>
        <span className="bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
          Add your friends
        </span>
      </h2>
      
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          type="text"
          value={personInput}
          onChange={(e) => setPersonInput(e.target.value)}
          placeholder="Enter person name"
          className="flex-1 px-5 py-3 border-2 border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none bg-white/80 backdrop-blur-sm shadow-md transition-all duration-300 placeholder-amber-600/60 text-lg"
        />
        <button
          type="submit"
          className="px-7 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center gap-2 font-semibold shadow-lg transform hover:scale-105 active:scale-95 text-lg"
        >
          <Plus size={22} />
          Add Person
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        {people.map((person, index) => (
          <div key={index} className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-amber-200 shadow-md hover:shadow-lg transition-all duration-300 group">
            <span className="text-amber-800 font-medium">{person}</span>
            <button
              onClick={() => onRemovePerson(index)}
              className="text-amber-600 hover:text-red-500 transition-colors duration-300 p-1 rounded-full hover:bg-red-50 group-hover:scale-110"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      
      {people.length === 0 && (
        <div className="text-center py-8">
          <div className="text-amber-400 mb-2">
            <Users size={48} className="mx-auto opacity-50" />
          </div>
          <p className="text-amber-600/70 italic font-medium">No people added yet</p>
          <p className="text-amber-500/50 text-sm mt-1">Add people to get started</p>
        </div>
      )}
    </div>
  );
};

export default PeopleInputForm;