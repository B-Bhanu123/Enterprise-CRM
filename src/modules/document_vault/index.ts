/**
 * Secure Document Vault Metadata Manager
 */

export interface VaultDocument {
  id: string;
  contractId?: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  encryptedHash: string;
}

export class DocumentVaultManager {
  private vault: Map<string, VaultDocument> = new Map();

  public uploadDocument(doc: VaultDocument): VaultDocument {
    this.vault.set(doc.id, doc);
    return doc;
  }

  public getDocument(docId: string): VaultDocument | undefined {
    return this.vault.get(docId);
  }
}
