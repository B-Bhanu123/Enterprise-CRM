/**
 * Contract Lifecycle Management (CLM) Engine
 */

export type ContractStatus = 'DRAFT' | 'IN_REVIEW' | 'PENDING_SIGNATURE' | 'EXECUTED' | 'EXPIRED';

export interface Contract {
  id: string;
  dealId: string;
  title: string;
  contractValueUSD: number;
  status: ContractStatus;
  signers: { email: string; signedAt?: string }[];
}

export class ContractCLMEngine {
  private contracts: Map<string, Contract> = new Map();

  public createContract(contract: Contract): Contract {
    this.contracts.set(contract.id, contract);
    return contract;
  }

  public signContract(contractId: string, signerEmail: string): ContractStatus {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const signer = contract.signers.find(s => s.email === signerEmail);
    if (signer) {
      signer.signedAt = new Date().toISOString();
    }

    const allSigned = contract.signers.every(s => !!s.signedAt);
    if (allSigned) {
      contract.status = 'EXECUTED';
    } else {
      contract.status = 'PENDING_SIGNATURE';
    }

    return contract.status;
  }
}
