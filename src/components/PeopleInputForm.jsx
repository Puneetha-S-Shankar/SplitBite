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
    <div style={{ background: '#fff', border: '2px solid #a65555', padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: '#a65555', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Users style={{ color: '#a65555' }} size={28} />
        Add your friends
      </h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <input
          type="text"
          value={personInput}
          onChange={(e) => setPersonInput(e.target.value)}
          placeholder="Enter person name"
          style={{ flex: 1, padding: '0.75rem 1rem', border: '2px solid #a65555', fontSize: '1.1rem', outline: 'none', background: '#f7f7f7', color: '#222', fontWeight: 500 }}
        />
        <button
          type="submit"
          style={{ padding: '0.75rem 2rem', background: '#a65555', color: '#fff', fontWeight: 600, fontSize: '1.1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={22} />
          Add Person
        </button>
      </form>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        {people.map((person, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f7b3b3', color: '#fff', padding: '0.5rem 1.25rem', border: '2px solid #a65555', fontWeight: 600 }}>
            <span>{person}</span>
            <button
              onClick={() => onRemovePerson(index)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 0, marginLeft: '0.5rem' }}
              title="Remove"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
      {people.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ color: '#f7b3b3', marginBottom: '0.5rem' }}>
            <Users size={48} style={{ opacity: 0.5 }} />
          </div>
          <p style={{ color: '#a65555', fontStyle: 'italic', fontWeight: 500 }}>No people added yet</p>
          <p style={{ color: '#a65555', opacity: 0.6, fontSize: '1rem', marginTop: '0.5rem' }}>Add people to get started</p>
        </div>
      )}
    </div>
  );
};

export default PeopleInputForm;