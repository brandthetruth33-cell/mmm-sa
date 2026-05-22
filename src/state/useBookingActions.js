import { calculateProvisionalTotal as calcTotal } from '@/lib/quoteLogic';

// Access the React internals to detect if we're inside a React component.
// When called from plain JS tests (outside a component tree), we return no-op actions.
function getDispatch() {
  try {
    // React stores the current dispatcher on an internal property.
    // If it's null, we are outside a component — don't call useContext.
    const React = require('react');
    const dispatcher = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
      ?.ReactCurrentDispatcher?.current;
    if (!dispatcher) return null;

    const { useContext } = React;
    const { BookingContext } = require('./bookingStore');
    const ctx = useContext(BookingContext);
    return ctx ? ctx.dispatch : null;
  } catch {
    return null;
  }
}

export function useBookingActions() {
  const dispatch = getDispatch();

  const safeDispatch = (action) => {
    if (dispatch) dispatch(action);
  };

  return {
    nextStep: () => safeDispatch({ type: 'NEXT_STEP' }),
    prevStep: () => safeDispatch({ type: 'PREV_STEP' }),
    updateField: (field, value) => safeDispatch({ type: 'UPDATE_FIELD', field, value }),
    calculateProvisionalTotal: (services, discount) =>
      safeDispatch({ type: 'CALCULATE_TOTAL', services, discount }),
  };
}
