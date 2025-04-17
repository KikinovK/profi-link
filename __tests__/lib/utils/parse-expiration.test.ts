import { parseExpiresInToSeconds } from '@/lib/utils/parse-expiration';

describe('parseExpiresInToSeconds', () => {
  it('parses seconds', () => {
    expect(parseExpiresInToSeconds('45s')).toBe(45);
  });

  it('parses minutes', () => {
    expect(parseExpiresInToSeconds('2m')).toBe(2 * 60);
  });

  it('parses hours', () => {
    expect(parseExpiresInToSeconds('3h')).toBe(3 * 60 * 60);
  });

  it('parses days', () => {
    expect(parseExpiresInToSeconds('5d')).toBe(5 * 60 * 60 * 24);
  });

  it('parses weeks', () => {
    expect(parseExpiresInToSeconds('1w')).toBe(1 * 60 * 60 * 24 * 7);
  });

  it('parses years', () => {
    expect(parseExpiresInToSeconds('1y')).toBe(1 * 60 * 60 * 24 * 365);
  });

  it('parses value without unit as seconds', () => {
    expect(parseExpiresInToSeconds('300')).toBe(300);
  });

  it('throws error for invalid unit', () => {
    expect(() => parseExpiresInToSeconds('10x')).toThrow('Invalid JWT_EXPIRES_IN format: "10x"');
  });

  it('throws error for completely invalid string', () => {
    expect(() => parseExpiresInToSeconds('abc')).toThrow('Invalid JWT_EXPIRES_IN format: "abc"');
  });

  it('throws error for empty string', () => {
    expect(() => parseExpiresInToSeconds('')).toThrow('Invalid JWT_EXPIRES_IN format: ""');
  });
});
