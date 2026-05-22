function Row({ label, value }) {
  if (!value) return null;
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ color: '#666', fontSize: 14 }}>{label}</span>
      <span style={{ fontWeight: 500 }}>{value}</span>
    </div>
  );
}

export default function ReviewStep({ data }) {
  const vehicle = [data?.year, data?.make, data?.model].filter(Boolean).join(' ') || '—';
  const location = [data?.street, data?.city, data?.state].filter(Boolean).join(', ') || '—';
  const schedule = [data?.date, data?.time].filter(Boolean).join(' at ') || '—';

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Review your booking</h2>
      <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 10, padding: '4px 16px' }}>
        <Row label="Zip Code" value={data?.zip || '—'} />
        <Row label="Vehicle" value={vehicle} />
        <Row label="Service" value={data?.service || '—'} />
        <Row label="Location" value={location} />
        <Row label="Schedule" value={schedule} />
        <Row label="Name" value={data?.name || '—'} />
        <Row label="Email" value={data?.email || '—'} />
        <Row label="Phone" value={data?.phone || '—'} />
        <Row label="Deposit" value="$49.00" />
      </div>
      <p style={{ marginTop: 16, color: '#555', fontSize: 14 }}>
        Please review the details above. Click Next to confirm and submit your booking.
      </p>
    </div>
  );
}
