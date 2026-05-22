export default function StepFooter({ onNext, onBack }) {
  return (
    <footer style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '16px 24px',
      borderTop: '1px solid #f0f0f0',
      background: '#fff',
    }}>
      <button
        onClick={onBack}
        style={{
          padding: '10px 24px',
          fontSize: 15,
          border: '2px solid #ccc',
          borderRadius: 8,
          background: '#fff',
          color: '#444',
        }}
      >
        Back
      </button>
      <button
        onClick={onNext}
        style={{
          padding: '10px 28px',
          fontSize: 15,
          border: 'none',
          borderRadius: 8,
          background: '#0070f3',
          color: '#fff',
          fontWeight: 600,
        }}
      >
        Next
      </button>
    </footer>
  );
}
