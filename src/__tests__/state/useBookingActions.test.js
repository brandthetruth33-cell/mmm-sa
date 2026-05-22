import { useBookingActions } from '@/state/useBookingActions';

describe('useBookingActions', () => {
  it('returns all required action functions', () => {
    const actions = useBookingActions();
    expect(typeof actions.nextStep).toBe('function');
    expect(typeof actions.prevStep).toBe('function');
    expect(typeof actions.updateField).toBe('function');
    expect(typeof actions.calculateProvisionalTotal).toBe('function');
  });

  it('nextStep does not throw', () => {
    const { nextStep } = useBookingActions();
    expect(() => nextStep()).not.toThrow();
  });

  it('prevStep does not throw', () => {
    const { prevStep } = useBookingActions();
    expect(() => prevStep()).not.toThrow();
  });

  it('updateField does not throw when called with a key and value', () => {
    const { updateField } = useBookingActions();
    expect(() => updateField('zip', '90210')).not.toThrow();
  });

  it('calculateProvisionalTotal does not throw', () => {
    const { calculateProvisionalTotal } = useBookingActions();
    expect(() => calculateProvisionalTotal()).not.toThrow();
  });
});
