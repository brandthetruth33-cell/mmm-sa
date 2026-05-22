import { validateField } from '@/lib/validators';

describe('validateField - zip code', () => {
  it('accepts a valid 5-digit US zip code', () => {
    expect(validateField('zip', '90210')).toBe(true);
  });

  it('rejects a zip code with letters', () => {
    expect(validateField('zip', 'ABC12')).toBe(false);
  });

  it('rejects a zip code shorter than 5 digits', () => {
    expect(validateField('zip', '1234')).toBe(false);
  });

  it('rejects a zip code longer than 5 digits', () => {
    expect(validateField('zip', '123456')).toBe(false);
  });

  it('rejects an empty zip code', () => {
    expect(validateField('zip', '')).toBe(false);
  });
});

describe('validateField - email', () => {
  it('accepts a valid email', () => {
    expect(validateField('email', 'user@example.com')).toBe(true);
  });

  it('rejects an email without @', () => {
    expect(validateField('email', 'userexample.com')).toBe(false);
  });

  it('rejects an email without domain', () => {
    expect(validateField('email', 'user@')).toBe(false);
  });

  it('rejects an empty email', () => {
    expect(validateField('email', '')).toBe(false);
  });
});

describe('validateField - phone', () => {
  it('accepts a valid 10-digit phone number', () => {
    expect(validateField('phone', '5551234567')).toBe(true);
  });

  it('accepts phone with formatting characters', () => {
    expect(validateField('phone', '(555) 123-4567')).toBe(true);
  });

  it('rejects a phone with fewer than 10 digits', () => {
    expect(validateField('phone', '12345')).toBe(false);
  });

  it('rejects an empty phone', () => {
    expect(validateField('phone', '')).toBe(false);
  });
});

describe('validateField - required generic field', () => {
  it('returns false for null', () => {
    expect(validateField('name', null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(validateField('name', undefined)).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(validateField('name', '   ')).toBe(false);
  });
});
