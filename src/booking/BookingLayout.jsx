export default function BookingLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5', padding: '40px 20px' }}>
      <div style={{
        maxWidth: 600,
        margin: '0 auto',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}>
        {children}
      </div>
    </div>
  );
}
