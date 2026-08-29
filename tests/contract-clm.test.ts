import { ContractCLMEngine } from '../src/modules/contract_clm';
import { DocumentVaultManager } from '../src/modules/document_vault';

describe('Contract CLM & Vault Manager', () => {
  it('should transition contract state to EXECUTED when all parties sign', () => {
    const clm = new ContractCLMEngine();
    clm.createContract({
      id: 'CTR-2026-01',
      dealId: 'DEAL-99',
      title: 'Enterprise Master Services Agreement',
      contractValueUSD: 250000,
      status: 'IN_REVIEW',
      signers: [
        { email: 'ceo@client.com' },
        { email: 'vp@vendor.com' }
      ]
    });

    clm.signContract('CTR-2026-01', 'ceo@client.com');
    const finalStatus = clm.signContract('CTR-2026-01', 'vp@vendor.com');

    expect(finalStatus).toBe('EXECUTED');
  });

  it('should store and retrieve encrypted document vault metadata', () => {
    const vault = new DocumentVaultManager();
    vault.uploadDocument({
      id: 'DOC-555',
      contractId: 'CTR-2026-01',
      fileName: 'msa_signed.pdf',
      fileSizeBytes: 2048500,
      mimeType: 'application/pdf',
      encryptedHash: 'sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    });

    const doc = vault.getDocument('DOC-555');
    expect(doc?.fileName).toBe('msa_signed.pdf');
  });
});
