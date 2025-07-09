import React, { useState } from 'react';
import { TrendingUp, DollarSign, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const ResultDisplay = ({ personTotals, totalBill, taxAmount, people, dishes, assignments }) => {
  const [saveStatus, setSaveStatus] = useState('idle'); // idle | saving | success | error
  const [message, setMessage] = useState('');

  const totalPaid = Object.values(personTotals).reduce((sum, amount) => sum + amount, 0);
  
  const handleSaveBill = async () => {
    setSaveStatus('saving');
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/bills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          billData: {
            personTotals,
            totalBill,
            taxAmount,
            people,
            dishes,
            assignments,
            savedAt: new Date().toISOString(),
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setSaveStatus('error');
        setMessage(data.message || 'Failed to save bill');
      } else {
        setSaveStatus('success');
        setMessage('Bill saved!');
      }
    } catch (err) {
      setSaveStatus('error');
      setMessage('Network error');
    }
  };

  return (
    <div style={{ background: '#fff', border: '2px solid #a65555', padding: '2.5rem', margin: '2rem 0' }}>
      <h2 style={{ color: '#a65555', fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <TrendingUp style={{ color: '#a65555' }} size={32} />
        Bill Summary
      </h2>
      
      {/* Bill Overview */}
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.5rem', flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <DollarSign style={{ color: '#fff' }} size={20} />
            <span style={{ fontWeight: 700 }}>Total Bill</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{`₹${totalBill.toFixed(2)}`}</div>
        </div>
        
        {taxAmount > 0 && (
          <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.5rem', flex: 1, minWidth: 220 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <DollarSign style={{ color: '#fff' }} size={20} />
              <span style={{ fontWeight: 700 }}>Tax/Service</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{`₹${taxAmount.toFixed(2)}`}</div>
          </div>
        )}
        
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.5rem', flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {Math.abs(totalPaid - totalBill) < 0.01 ? (
              <CheckCircle style={{ color: '#fff' }} size={20} />
            ) : (
              <AlertCircle style={{ color: '#fff' }} size={20} />
            )}
            <span style={{ fontWeight: 700 }}>Verification</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: Math.abs(totalPaid - totalBill) < 0.01 ? '#fff' : '#fff' }}>
            {Math.abs(totalPaid - totalBill) < 0.01 ? '✓ Correct' : '✗ Error'}
          </div>
        </div>
      </div>

      {/* Individual Amounts */}
      <div style={{ borderTop: '2px solid #a65555', paddingTop: '2rem', marginTop: '2rem' }}>
        <h3 style={{ color: '#a65555', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem' }}>Amount each person should pay:</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(personTotals)
            .sort(([,a], [,b]) => b - a) // Sort by amount descending
            .map(([person, amount], index) => (
              <div key={person} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f7b3b3', color: '#fff', padding: '1rem 1.5rem', border: '2px solid #a65555', fontWeight: 600 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: 36, height: 36, background: '#a65555', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>{index + 1}</div>
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{person}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.3rem' }}>{`₹${amount.toFixed(2)}`}</span>
                  <div style={{ fontSize: '1rem', color: '#fff', opacity: 0.8 }}>{((amount / totalBill) * 100).toFixed(1)}% of total</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '2px solid #a65555', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.2rem 2rem', minWidth: 120, textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>People</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{Object.keys(personTotals).length}</div>
        </div>
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.2rem 2rem', minWidth: 120, textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Average</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{`₹${(totalBill / Object.keys(personTotals).length).toFixed(2)}`}</div>
        </div>
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.2rem 2rem', minWidth: 120, textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Highest</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{`₹${Math.max(...Object.values(personTotals)).toFixed(2)}`}</div>
        </div>
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1.2rem 2rem', minWidth: 120, textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 600 }}>Lowest</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{`₹${Math.min(...Object.values(personTotals)).toFixed(2)}`}</div>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center">
        <button
          onClick={handleSaveBill}
          disabled={saveStatus === 'saving' || saveStatus === 'success'}
          className={`enhanced-btn big-dark-btn save-bill-btn ${saveStatus === 'success' ? 'opacity-60 cursor-not-allowed' : ''}`}
          style={{
            width: 260,
            fontSize: '1.25rem',
            padding: '1.1rem 0',
            margin: '1.5rem auto 0 auto',
            background: saveStatus === 'success' ? '#bbf7d0' : '#fbbf24',
            color: saveStatus === 'success' ? '#15803d' : '#7c3f00',
            border: '2px solid #fbbf24',
            fontWeight: 800,
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            boxShadow: '0 4px 16px rgba(251,191,36,0.08)',
            borderRadius: 8,
            transition: 'background 0.2s, color 0.2s, border 0.2s',
          }}
        >
          {saveStatus === 'saving' && <Loader2 className="animate-spin" size={22} />}
          {saveStatus === 'success' && <CheckCircle size={22} />}
          {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : 'Save Bill'}
        </button>
        {message && <div className={`mt-2 text-sm ${saveStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
      </div>
    </div>
  );
};

export default ResultDisplay;