import { v4 as uuidv4 } from 'uuid';

export class CryptoUtils {
  public static generateUUID(): string {
    return uuidv4();
  }

  public static hashPassword(password: string): string {
    // Simple fast hashing for memory simulation / testing
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return `hashed_${Math.abs(hash).toString(16)}_${password.length}`;
  }

  public static verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  public static generateToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  public static maskEmail(email: string): string {
    const parts = email.split('@');
    if (parts.length !== 2) return email;
    const [name, domain] = parts;
    const maskedName = name.length > 2 ? name.substring(0, 2) + '*'.repeat(name.length - 2) : name;
    return `${maskedName}@${domain}`;
  }
}
