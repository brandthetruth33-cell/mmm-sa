import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
      <h1 style={{ fontSize: 36, marginBottom: 16 }}>Mobile Mechanic Booking</h1>
      <p style={{ marginBottom: 32, color: '#555' }}>Get your car fixed at home, work, or anywhere.</p>
      <Link href="/booking" style={{ background: '#0070f3', color: '#fff', padding: '14px 32px', borderRadius: 8, textDecoration: 'none', fontSize: 18 }}>
        Book a Mechanic
      </Link>
    </main>
  );
}
