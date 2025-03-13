import bcrypt from "bcrypt";

/**
 * Hashes a password using bcrypt.
 * @param password The plain text password
 * @returns The hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // Higher value means more secure but slower
  return await bcrypt.hash(password, saltRounds);
};
