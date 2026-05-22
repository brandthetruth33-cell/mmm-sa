export default function ZipStep({ data, onUpdate }) {
  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>Where are you located?</h2>
      <label htmlFor="zip" style={{ display: 'block', marginBottom: 8 }}>Enter your zip code</label>
      <input
        id="zip"
        type="text"
        maxLength={5}
        value={data?.zip || ''}
        onChange={e => onUpdate('zip', e.target.value)}
        placeholder="e.g. 90210"
        style={{ padding: '10px 14px', fontSize: 16, border: '1px solid #ccc', borderRadius: 6, width: '100%' }}
      />
    </div>
  );
}
