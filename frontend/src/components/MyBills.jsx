import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Users, Utensils, Receipt, IndianRupee } from 'lucide-react';

const MyBills = ({ onBack }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('https://splitbite.onrender.com/api/bills', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.message || 'Failed to fetch bills');
        } else {
          const data = await res.json();
          setBills(data);
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  return (
    <div className="enhanced-card" style={{
      maxWidth: 800,
      margin: '4rem auto 2rem auto',
      padding: '2.5rem 2rem 2rem 2rem',
      background: '#f5f5f4',
      border: '2px solid #e5e5e5',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <button
        onClick={onBack}
        className="enhanced-btn"
        style={{
          marginBottom: '2rem',
          background: '#fbbf24',
          color: '#7c3f00',
          borderColor: '#fbbf24',
          fontWeight: 700,
          fontSize: '1rem',
          width: 'fit-content',
          minWidth: 180,
          padding: '0.8rem 2.2rem',
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        <span style={{ fontSize: '1.2em', marginRight: 8 }}>&larr;</span> Back to Split
      </button>
      <h2 style={{
        fontSize: '2rem',
        fontWeight: 800,
        letterSpacing: '-1px',
        marginBottom: '2rem',
        color: '#7c3f00',
        textAlign: 'center',
        width: '100%',
        borderBottom: '2px solid #e5e5e5',
        paddingBottom: '1rem',
        background: 'none',
      }}>
        My Bills
      </h2>
      {loading && <div style={{ color: '#7c3f00', fontWeight: 600 }}>Loading...</div>}
      {error && <div style={{ color: '#be123c', fontWeight: 600 }}>{error}</div>}
      {!loading && !error && bills.length === 0 && <div style={{ color: '#7c3f00', fontWeight: 600 }}>No bills found.</div>}
      <ul style={{ width: '100%', marginTop: 24, padding: 0, listStyle: 'none' }}>
        {bills.map((bill, idx) => {
          const { billData } = bill;
          return (
            <li
              key={bill._id}
              className="enhanced-card"
              style={{
                border: '2px solid #e5e5e5',
                background: '#fff',
                marginBottom: 28,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '1.5rem 1.2rem',
                width: '100%',
                transition: 'box-shadow 0.2s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: '1.1rem', color: '#7c3f00' }}>
                    <Receipt size={20} />
                    Bill #{bills.length - idx}
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#b45309', marginTop: 2 }}>{new Date(bill.createdAt).toLocaleString()}</div>
                  <div style={{ display: 'flex', gap: 18, marginTop: 6, fontSize: '0.98rem', color: '#a16207' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><IndianRupee size={16} />{billData?.totalBill?.toFixed(2) ?? '-'} total</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={16} />{billData?.people?.length ?? '-'} people</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Utensils size={16} />{billData?.dishes?.length ?? '-'} dishes</span>
                  </div>
                </div>
                <button
                  className="enhanced-btn"
                  style={{
                    background: '#f5f5f4',
                    color: '#b45309',
                    border: '2px solid #fbbf24',
                    fontWeight: 600,
                    fontSize: '1rem',
                    padding: '0.5rem 1.2rem',
                    borderRadius: 0,
                    boxShadow: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onClick={() => setExpanded(expanded === bill._id ? null : bill._id)}
                >
                  {expanded === bill._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  {expanded === bill._id ? 'Hide' : 'View Details'}
                </button>
              </div>
              {expanded === bill._id && (
                <div style={{ marginTop: 22, background: '#f5f5f4', borderTop: '2px solid #e5e5e5', padding: '1.2rem 0.5rem 0.5rem 0.5rem', borderRadius: 0 }}>
                  {/* Person Totals Table */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#7c3f00' }}>Who owes what:</div>
                    <table style={{ width: '100%', fontSize: '0.98rem', borderCollapse: 'collapse', background: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#f3e8d2', color: '#7c3f00' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 700, borderBottom: '2px solid #e5e5e5' }}>Person</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700, borderBottom: '2px solid #e5e5e5' }}>Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billData?.personTotals && Object.entries(billData.personTotals).map(([person, amount]) => (
                          <tr key={person}>
                            <td style={{ padding: '0.5rem', fontWeight: 600, borderBottom: '1px solid #f3e8d2' }}>{person}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid #f3e8d2' }}>{amount.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Dishes Table */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: '#7c3f00' }}>Dishes & Consumers:</div>
                    <table style={{ width: '100%', fontSize: '0.98rem', borderCollapse: 'collapse', background: '#fff' }}>
                      <thead>
                        <tr style={{ background: '#f3e8d2', color: '#7c3f00' }}>
                          <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 700, borderBottom: '2px solid #e5e5e5' }}>Dish</th>
                          <th style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 700, borderBottom: '2px solid #e5e5e5' }}>Cost (₹)</th>
                          <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: 700, borderBottom: '2px solid #e5e5e5' }}>Consumers</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billData?.dishes && billData.dishes.map(dish => (
                          <tr key={dish.id}>
                            <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3e8d2' }}>{dish.name}</td>
                            <td style={{ padding: '0.5rem', textAlign: 'right', borderBottom: '1px solid #f3e8d2' }}>{dish.cost}</td>
                            <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3e8d2' }}>{dish.consumers?.join(', ')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Tax and Total */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: '0.98rem', color: '#7c3f00' }}>
                    <div>Tax/Service: <span style={{ fontWeight: 700 }}>₹{billData?.taxAmount?.toFixed(2) ?? '0.00'}</span></div>
                    <div>Total Bill: <span style={{ fontWeight: 700 }}>₹{billData?.totalBill?.toFixed(2) ?? '-'}</span></div>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyBills; 