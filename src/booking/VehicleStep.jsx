export default function VehicleStep({ data, onUpdate }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Tell us about your vehicle</h2>
      {['year', 'make', 'model'].map(field => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6, textTransform: 'capitalize' }}>{field}</label>
          <input
            type="text"
            value={data?.[field] || ''}
            onChange={e => onUpdate(field, e.target.value)}
            placeholder={field === 'year' ? 'e.g. 2019' : field === 'make' ? 'e.g. Toyota' : 'e.g. Camry'}
            style={{ padding: '10px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 6, width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
}
