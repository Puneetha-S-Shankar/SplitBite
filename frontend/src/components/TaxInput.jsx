import React from 'react';
import { Receipt, Info } from 'lucide-react';

const TaxInput = ({ taxAmount, onTaxChange }) => {
  return (
    <div style={{ background: '#fff', border: '2px solid #a65555', padding: '2rem', marginBottom: '2rem' }}>
      <h2 style={{ color: '#a65555', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Receipt style={{ color: '#a65555' }} size={28} />
        Tax & Service Charges
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <input
          type="number"
          value={taxAmount}
          onChange={(e) => onTaxChange(e.target.value)}
          placeholder="Enter tax amount"
          step="0.01"
          min="0"
          style={{ width: '100%', padding: '0.75rem 1rem', border: '2px solid #a65555', fontSize: '1.1rem', outline: 'none', background: '#f7f7f7', color: '#222', fontWeight: 500 }}
        />
        <div style={{ background: '#f7b3b3', color: '#fff', border: '2px solid #a65555', padding: '1rem', fontWeight: 600, display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
          <Info style={{ color: '#fff', marginTop: 4 }} size={20} />
          <div>
            <span>Tax and service charges will be split equally among all people</span>
            {taxAmount && parseFloat(taxAmount) > 0 && (
              <div style={{ fontWeight: 700, marginTop: '0.5rem' }}>
                Current tax: ₹{parseFloat(taxAmount).toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaxInput;