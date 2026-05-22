function generateConfirmationNumber() {
  return 'MMM-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ConfirmationStep({ data }) {
  const confirmationNumber = generateConfirmationNumber();
  const schedule = [data?.date, data?.time].filter(Boolean).join(' at ') || 'your scheduled time';

  return (
    <div style={{ padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 26, marginBottom: 8 }}>Booking Confirmed!</h2>
      <p style={{ color: '#555', marginBottom: 24 }}>
        A mechanic will arrive on {schedule}.
      </p>
      <div style={{
        background: '#f0f7ff', border: '1px solid #b3d4ff', borderRadius: 10,
        padding: '16px 24px', display: 'inline-block', marginBottom: 24,
      }}>
        <p style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Confirmation Number</p>
        <p style={{ fontSize: 22, fontWeight: 700, letterSpacing: 2, color: '#0070f3' }}>{confirmationNumber}</p>
      </div>
      <p style={{ color: '#777', fontSize: 14 }}>
        A confirmation has been sent to <strong>{data?.email || 'your email'}</strong>.<br />
        If you have questions, please reference your confirmation number.
      </p>
    </div>
  );
}
