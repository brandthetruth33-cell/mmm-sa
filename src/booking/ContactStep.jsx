export default function ContactStep({ data, onUpdate }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Your contact information</h2>
      {[
        { field: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. Jane Smith' },
        { field: 'email', label: 'Email Address', type: 'email', placeholder: 'e.g. jane@example.com' },
        { field: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'e.g. (555) 867-5309' },
      ].map(({ field, label, type, placeholder }) => (
        <div key={field} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>{label}</label>
          <input
            type={type}
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
