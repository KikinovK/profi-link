const timeUnitToSeconds = {
  s: 1,
  m: 60,
  h: 60 * 60,
  d: 60 * 60 * 24,
  w: 60 * 60 * 24 * 7,
  y: 60 * 60 * 24 * 365,
};

/**
 * Parse a string representing a time duration (e.g. "15m", "3h", "2d", etc.)
 * and return the equivalent number of seconds.
 *
 * The string is expected to be in the format `\d+[smhdwy]?`, where
 *   - `\d+` is a one or more digits
 *   - `[smhdwy]?` is an optional single character that is one of
 *     - `s`: seconds
 *     - `m`: minutes
 *     - `h`: hours
 *     - `d`: days
 *     - `w`: weeks
 *     - `y`: years
 *
 * If the string does not match this format, an `Error` is thrown.
 *
 * @param {string} expiresIn - The string to parse.
 * @returns {number} The equivalent number of seconds.
 * @throws {Error} If the string does not match the expected format.
 */
export const parseExpiresInToSeconds = (expiresIn: string): number => {
  const match = expiresIn.match(/^(\d+)([smhdwy]?)$/);

  if (!match) {
    throw new Error(`Invalid JWT_EXPIRES_IN format: "${expiresIn}"`);
  }

  const [, amountStr, unit] = match;
  const amount = parseInt(amountStr, 10);
  const multiplier = unit ? timeUnitToSeconds[unit as keyof typeof timeUnitToSeconds] : 1;

  return amount * multiplier;
};
