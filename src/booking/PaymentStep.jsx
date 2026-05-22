export default function PaymentStep({ data, onUpdate }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Payment</h2>
      <div style={{
        background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10,
        padding: '20px 24px', marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ color: '#555' }}>Deposit required today</span>
          <span style={{ fontWeight: 700, fontSize: 20 }}>$49.00</span>
        </div>
        <p style={{ color: '#888', fontSize: 13 }}>
          The remaining balance is due at the time of service.
        </p>
      </div>
      <div style={{
        background: '#f0f7ff', border: '1px solid #b3d4ff', borderRadius: 8,
        padding: '14px 18px', display: 'flex', alignItems: 'flex-start', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>🔒</span>
        <p style={{ fontSize: 14, color: '#333' }}>
          Payment details are collected securely at checkout. We use industry-standard encryption and never store your card information.
        </p>
      </div>
      <div style={{ marginTop: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={data?.termsAccepted || false}
            onChange={e => onUpdate('termsAccepted', e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          <span style={{ fontSize: 14 }}>I agree to the terms of service and cancellation policy</span>
        </label>
      </div>
    </div>
  );
}
