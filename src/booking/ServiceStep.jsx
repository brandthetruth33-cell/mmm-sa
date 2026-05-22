const SERVICES = ['Oil Change', 'Brake Inspection', 'Tire Rotation', 'Battery Replacement', 'Engine Diagnostics'];

export default function ServiceStep({ data, onUpdate }) {
  const selected = data?.service || '';
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>What service do you need?</h2>
      {SERVICES.map(s => (
        <button
          key={s}
          onClick={() => onUpdate('service', s)}
          style={{
            display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
            marginBottom: 10, border: `2px solid ${selected === s ? '#0070f3' : '#ccc'}`,
            borderRadius: 8, background: selected === s ? '#e8f0fe' : '#fff', fontSize: 15,
          }}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
