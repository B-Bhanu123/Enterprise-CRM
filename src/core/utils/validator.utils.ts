export class ValidatorUtils {
  public static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
  }

  public static isValidURL(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  public static sanitizeString(str: string): string {
    return str.replace(/<[^>]*>?/gm, '').trim();
  }

  public static isNonEmptyString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  public static isPositiveNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && value > 0;
  }
}
