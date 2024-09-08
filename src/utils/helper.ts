import * as crypto from 'crypto';

// Function to generate a password
export function generatePassword(length: number = 8): string {
  const charset: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password: string = '';
  const randomBytes: Buffer = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    const randomIndex: number = randomBytes[i] % charset.length;
    password += charset[randomIndex];
  }

  return password;
}

// Default export of the function
export default generatePassword;
