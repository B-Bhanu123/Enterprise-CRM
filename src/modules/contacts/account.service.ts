import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { NotFoundError } from '../../core/errors/app.error.js';
import { Currency, PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { AccountEntity, CompanyTier, CreateAccountDTO } from './contact.entity.js';
import { LoggerService } from '../../core/logger/logger.service.js';

export class AccountService {
  private static instance: AccountService;
  private db = MemoryDatabase.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'accounts';

  private constructor() {}

  public static getInstance(): AccountService {
    if (!AccountService.instance) {
      AccountService.instance = new AccountService();
    }
    return AccountService.instance;
  }

  public createAccount(dto: CreateAccountDTO): AccountEntity {
    const accountId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();

    const empCount = dto.employeeCount || 50;
    let tier = dto.tier;
    if (!tier) {
      if (empCount >= 5000) tier = CompanyTier.FORTUNE_500;
      else if (empCount >= 1000) tier = CompanyTier.ENTERPRISE;
      else if (empCount >= 100) tier = CompanyTier.MID_MARKET;
      else tier = CompanyTier.STARTUP;
    }

    const account: AccountEntity = {
      id: accountId,
      name: ValidatorUtils.sanitizeString(dto.name),
      domain: dto.domain,
      industry: dto.industry || 'Technology',
      tier,
      annualRevenue: dto.annualRevenue || 1000000,
      employeeCount: empCount,
      currency: dto.currency || Currency.USD,
      parentAccountId: dto.parentAccountId,
      ownerId: dto.ownerId,
      healthScore: 85, // Initial good health score
      totalARR: 0,
      activeDealsCount: 0,
      tenantId: dto.tenantId || 'tenant_default',
      createdAt: now,
      updatedAt: now
    };

    const saved = this.db.insert<AccountEntity>(this.TABLE_NAME, account);
    this.logger.info('AccountService', `Created account '${saved.id}' (${saved.name}) - Tier: ${tier}`);
    return saved;
  }

  public getAccountById(id: string): AccountEntity {
    const account = this.db.findById<AccountEntity>(this.TABLE_NAME, id);
    if (!account) {
      throw new NotFoundError('Account', id);
    }
    return account;
  }

  public updateAccountMetrics(accountId: string, totalARR: number, activeDealsCount: number): AccountEntity {
    const account = this.getAccountById(accountId);
    let healthScore = account.healthScore;

    if (totalARR > 100000) healthScore = Math.min(healthScore + 10, 100);
    if (activeDealsCount === 0) healthScore = Math.max(healthScore - 15, 0);

    return this.db.update<AccountEntity>(this.TABLE_NAME, accountId, {
      totalARR,
      activeDealsCount,
      healthScore
    });
  }

  public queryAccounts(options: QueryOptions = {}): PaginatedResult<AccountEntity> {
    return this.db.query<AccountEntity>(this.TABLE_NAME, options);
  }
}
