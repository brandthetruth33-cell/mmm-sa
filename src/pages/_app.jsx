import { BookingProvider } from '@/state/bookingStore';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <BookingProvider>
      <Component {...pageProps} />
    </BookingProvider>
  );
}
