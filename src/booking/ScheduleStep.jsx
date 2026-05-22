const TIME_SLOTS = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'];

function getDateLabels() {
  const labels = [];
  const today = new Date();
  for (let i = 1; i <= 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    labels.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
  }
  return labels;
}

export default function ScheduleStep({ data, onUpdate }) {
  const dates = getDateLabels();
  const selectedDate = data?.date || '';
  const selectedTime = data?.time || '';

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 16 }}>When works for you?</h2>
      <p style={{ marginBottom: 12, color: '#555' }}>Select a date:</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {dates.map(date => (
          <button
            key={date}
            onClick={() => onUpdate('date', date)}
            style={{
              padding: '10px 16px', borderRadius: 8, fontSize: 14,
              border: `2px solid ${selectedDate === date ? '#0070f3' : '#ccc'}`,
              background: selectedDate === date ? '#e8f0fe' : '#fff',
            }}
          >
            {date}
          </button>
        ))}
      </div>
      <p style={{ marginBottom: 12, color: '#555' }}>Select a time:</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {TIME_SLOTS.map(time => (
          <button
            key={time}
            onClick={() => onUpdate('time', time)}
            style={{
              padding: '10px 16px', borderRadius: 8, fontSize: 14,
              border: `2px solid ${selectedTime === time ? '#0070f3' : '#ccc'}`,
              background: selectedTime === time ? '#e8f0fe' : '#fff',
            }}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
}
