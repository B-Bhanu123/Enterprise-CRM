import { ValidatorUtils } from '../src/core/utils/validator.utils.js';

describe('Test Case 5: Bulk Contact CSV Import & Schema Validation Engine', () => {
  it('should validate email format and sanitize string fields', () => {
    const rawInput = {
      firstName: '<script>alert("hack")</script> Alice  ',
      lastName: ' Smith ',
      email: 'ALICE.SMITH@ENTERPRISE.COM',
      phone: '+1 (555) 234-5678'
    };

    expect(ValidatorUtils.isValidEmail(rawInput.email)).toBe(true);
    expect(ValidatorUtils.isValidPhone(rawInput.phone)).toBe(true);
    expect(ValidatorUtils.sanitizeString(rawInput.firstName)).toBe('Alice');
    expect(ValidatorUtils.sanitizeString(rawInput.lastName)).toBe('Smith');
  });

  it('should reject malformed email addresses', () => {
    const invalidEmails = ['plainaddress', '@missinguser.com', 'user@.com', 'user@domain..com'];
    for (const email of invalidEmails) {
      expect(ValidatorUtils.isValidEmail(email)).toBe(false);
    }
  });
});
