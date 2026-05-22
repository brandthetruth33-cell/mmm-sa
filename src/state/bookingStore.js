import { createContext, useContext, useReducer } from 'react';
import { calculateProvisionalTotal as calcTotal } from '@/lib/quoteLogic';

export const bookingStore = {
  zip: '',
  vehicle: {},
  services: [],
  location: {},
  schedule: {},
  contact: {},
  provisionalTotal: 0,
  paymentMode: 'deposit',
  quoteId: null,
  currentStep: 0,
};

function bookingReducer(state, action) {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(0, state.currentStep - 1) };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'CALCULATE_TOTAL':
      return {
        ...state,
        provisionalTotal: calcTotal({
          services: state.services,
          discount: state.discount || 0,
        }),
      };
    default:
      return state;
  }
}

export const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, bookingStore);
  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBookingStore() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBookingStore must be used within a BookingProvider');
  }
  return ctx;
}
