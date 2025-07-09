import React from 'react';
import { Users, CheckCircle, AlertCircle } from 'lucide-react';

const DishAssignmentForm = ({ dishes, people, onToggleConsumer }) => {
  if (dishes.length === 0 || people.length === 0) {
    return (
      <div style={{ background: '#fff', border: '2px solid #a65555', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#a65555', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Users style={{ color: '#a65555' }} size={28} />
          Who ate what?
        </h2>
        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
          <div style={{ color: '#f7b3b3', marginBottom: '0.5rem' }}>
            <Users size={48} style={{ opacity: 0.5 }} />
          </div>
          <p style={{ color: '#a65555', fontStyle: 'italic', fontWeight: 500 }}>Please add both people and dishes to start assigning</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', border: '2px solid #a65555', padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: '#a65555', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Users style={{ color: '#a65555' }} size={28} />
        Who ate what?
      </h2>
      <p style={{ color: '#a65555', fontWeight: 600, marginBottom: '1.5rem' }}>
        For each dish, select who ate it:
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {dishes.map((dish) => (
          <div key={dish.id} style={{ background: '#f7b3b3', color: '#fff', padding: '1.5rem', border: '2px solid #a65555', fontWeight: 600 }}>
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: '#fff', marginBottom: '0.25rem' }}>{dish.name}</h3>
              <p style={{ color: '#fff', fontWeight: 600, fontSize: '1.1rem' }}>₹{dish.cost.toFixed(2)}</p>
            </div>
            <form style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', alignItems: 'center' }}>
              {people.map((person) => {
                const checked = dish.consumers.includes(person);
                return (
                  <label
                    key={person}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: checked ? '#a65555' : '#fff',
                      color: checked ? '#fff' : '#a65555',
                      border: '2px solid #a65555',
                      fontWeight: 600,
                      padding: '0.5rem 1.25rem',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleConsumer(dish.id, person)}
                      style={{ width: 22, height: 22, accentColor: '#a65555', margin: 0 }}
                    />
                    <span>{person}</span>
                  </label>
                );
              })}
            </form>
            {dish.consumers.length > 0 && (
              <div style={{ background: '#fff', color: '#a65555', border: '2px solid #a65555', padding: '1rem', marginTop: '0.5rem', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CheckCircle style={{ color: '#a65555' }} size={20} />
                  <span style={{ fontWeight: 700 }}>Consumers</span>
                </div>
                <span>{dish.consumers.join(', ')}</span>
                <div style={{ fontWeight: 600, marginTop: '0.5rem' }}>
                  Cost per person: ₹{(dish.cost / dish.consumers.length).toFixed(2)}
                </div>
              </div>
            )}
            {dish.consumers.length === 0 && (
              <div style={{ background: '#fff', color: '#a65555', border: '2px solid #a65555', padding: '1rem', marginTop: '0.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle style={{ color: '#a65555' }} size={20} />
                <span>No one assigned to this dish yet</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DishAssignmentForm;