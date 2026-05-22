export default function ProgressHeader({ currentStep, steps }) {
  const total = steps?.length || 1;
  const percent = ((currentStep + 1) / total) * 100;
  const stepLabel = steps?.[currentStep] || '';

  return (
    <header style={{ padding: '20px 24px 0', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, alignItems: 'baseline' }}>
        <span style={{ fontWeight: 600, fontSize: 16 }}>{stepLabel}</span>
        <span style={{ fontSize: 13, color: '#888' }}>Step {currentStep + 1} of {total}</span>
      </div>
      <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            width: `${percent}%`,
            background: '#0070f3',
            borderRadius: 3,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </header>
  );
}
