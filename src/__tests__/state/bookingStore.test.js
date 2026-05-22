import { bookingStore } from '@/state/bookingStore';

describe('bookingStore initial state', () => {
  it('has an empty zip string', () => {
    expect(bookingStore.zip).toBe('');
  });

  it('has an empty vehicle object', () => {
    expect(bookingStore.vehicle).toEqual({});
  });

  it('has an empty services array', () => {
    expect(bookingStore.services).toEqual([]);
  });

  it('has an empty location object', () => {
    expect(bookingStore.location).toEqual({});
  });

  it('has an empty schedule object', () => {
    expect(bookingStore.schedule).toEqual({});
  });

  it('has an empty contact object', () => {
    expect(bookingStore.contact).toEqual({});
  });

  it('has a provisionalTotal of 0', () => {
    expect(bookingStore.provisionalTotal).toBe(0);
  });

  it('defaults paymentMode to deposit', () => {
    expect(bookingStore.paymentMode).toBe('deposit');
  });

  it('has a null quoteId', () => {
    expect(bookingStore.quoteId).toBeNull();
  });

  it('starts at step 0', () => {
    expect(bookingStore.currentStep).toBe(0);
  });

  it('has all required fields', () => {
    const requiredFields = ['zip', 'vehicle', 'services', 'location', 'schedule', 'contact', 'provisionalTotal', 'paymentMode', 'quoteId', 'currentStep'];
    requiredFields.forEach((field) => {
      expect(bookingStore).toHaveProperty(field);
    });
  });
});
