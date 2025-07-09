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
    <div style={{ background: '#fff', border: '2px solid #a65555', padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: '#a65555', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <UtensilsCrossed style={{ color: '#a65555' }} size={28} />
        What and all did you guys eat
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={dishInput.name}
          onChange={(e) => setDishInput({ ...dishInput, name: e.target.value })}
          placeholder="Dish name"
          style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #a65555', fontSize: '1.1rem', outline: 'none', background: '#f7f7f7', color: '#222', fontWeight: 500 }}
        />
        <input
          type="number"
          value={dishInput.cost}
          onChange={(e) => setDishInput({ ...dishInput, cost: e.target.value })}
          placeholder="Cost"
          step="0.01"
          min="0"
          style={{ width: '8rem', padding: '0.75rem 1rem', border: '2px solid #a65555', fontSize: '1.1rem', outline: 'none', background: '#f7f7f7', color: '#222', fontWeight: 500 }}
        />
        <button
          type="submit"
          style={{ padding: '0.75rem 2rem', background: '#a65555', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={22} />
          Add Dish
        </button>
      </form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {dishes.map((dish) => (
          <div key={dish.id} style={{ background: '#f7b3b3', color: '#fff', padding: '1rem 1.5rem', border: '2px solid #a65555', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 600 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>{dish.name}</h3>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>₹{dish.cost.toFixed(2)}</p>
            </div>
            <button
              onClick={() => onRemoveDish(dish.id)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, marginLeft: '0.5rem' }}
              title="Remove"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>
      {dishes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ color: '#f7b3b3', marginBottom: '0.5rem' }}>
            <UtensilsCrossed size={48} style={{ opacity: 0.5 }} />
          </div>
          <p style={{ color: '#a65555', fontStyle: 'italic', fontWeight: 500 }}>No dishes added yet</p>
          <p style={{ color: '#a65555', opacity: 0.6, fontSize: '1rem', marginTop: '0.5rem' }}>Add dishes to split the bill</p>
        </div>
      )}
    </div>
  );
};

export default DishInputForm;