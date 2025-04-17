import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hashes a plain text password using bcrypt.
 *
 * @param password the plain text password
 * @returns a Promise that resolves to the hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  return hashed;
}

/**
 * Compares a plain text password with a hashed password.
 *
 * @param plainPassword the plain text password
 * @param hashedPassword the hashed password
 * @returns a boolean indicating whether the passwords match
 */
export  const comparePasswords = async(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
}
