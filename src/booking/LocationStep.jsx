export default function LocationStep({ data, onUpdate }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Where should we come to you?</h2>
      {[
        { field: 'street', label: 'Street Address', placeholder: 'e.g. 123 Main St' },
        { field: 'city', label: 'City', placeholder: 'e.g. Los Angeles' },
        { field: 'state', label: 'State', placeholder: 'e.g. CA' },
      ].map(({ field, label, placeholder }) => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>
          <input
            type="text"
            value={data?.[field] || ''}
            onChange={e => onUpdate(field, e.target.value)}
            placeholder={placeholder}
            style={{ padding: '10px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 6, width: '100%' }}
          />
        </div>
      ))}
    </div>
  );
}
