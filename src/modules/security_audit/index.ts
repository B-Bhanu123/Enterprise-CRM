/**
 * Security Audit & PII Masking Engine
 */

export class SecurityAuditEngine {
  public maskPII(text: string): string {
    // Mask emails: a***e@domain.com
    const emailMasked = text.replace(/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, p1, p2) => {
      if (p1.length <= 2) return `${p1[0]}*@${p2}`;
      return `${p1[0]}${'*'.repeat(p1.length - 2)}${p1[p1.length - 1]}@${p2}`;
    });

    // Mask phone numbers
    const phoneMasked = emailMasked.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '***-***-****');
    return phoneMasked;
  }
}
