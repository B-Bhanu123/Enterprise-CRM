import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { ConflictError, NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { PaginatedResult, QueryOptions } from '../../core/types/common.types.js';
import { EventBus } from '../../core/events/event.bus.js';
import { ContactEntity, CreateContactDTO, LifecycleStage } from './contact.entity.js';
import { LoggerService } from '../../core/logger/logger.service.js';

export class ContactService {
  private static instance: ContactService;
  private db = MemoryDatabase.getInstance();
  private eventBus = EventBus.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'contacts';

  private constructor() {}

  public static getInstance(): ContactService {
    if (!ContactService.instance) {
      ContactService.instance = new ContactService();
    }
    return ContactService.instance;
  }

  public createContact(dto: CreateContactDTO): ContactEntity {
    if (!ValidatorUtils.isValidEmail(dto.email)) {
      throw new ValidationError(`Invalid email: ${dto.email}`);
    }

    const existing = this.db.query<ContactEntity>(this.TABLE_NAME, {
      filters: [{ field: 'email', operator: 'eq', value: dto.email.toLowerCase() }],
      tenantId: dto.tenantId
    });

    if (existing.total > 0) {
      throw new ConflictError(`Contact with email '${dto.email}' already exists`);
    }

    const contactId = CryptoUtils.generateUUID();
    const now = new Date().toISOString();

    const contact: ContactEntity = {
      id: contactId,
      firstName: ValidatorUtils.sanitizeString(dto.firstName),
      lastName: ValidatorUtils.sanitizeString(dto.lastName),
      email: dto.email.toLowerCase(),
      phone: dto.phone,
      title: ValidatorUtils.sanitizeString(dto.title),
      department: dto.department,
      accountId: dto.accountId,
      lifecycleStage: dto.lifecycleStage || LifecycleStage.LEAD,
      isPrimaryContact: dto.isPrimaryContact || false,
      tenantId: dto.tenantId || 'tenant_default',
      ownerId: dto.ownerId,
      createdAt: now,
      updatedAt: now
    };

    const saved = this.db.insert<ContactEntity>(this.TABLE_NAME, contact);
    this.logger.info('ContactService', `Created contact '${saved.id}' (${saved.firstName} ${saved.lastName})`);

    this.eventBus.publish('contact.created', saved, saved.tenantId);
    return saved;
  }

  public getContactById(id: string): ContactEntity {
    const contact = this.db.findById<ContactEntity>(this.TABLE_NAME, id);
    if (!contact) {
      throw new NotFoundError('Contact', id);
    }
    return contact;
  }

  public updateLifecycleStage(id: string, stage: LifecycleStage): ContactEntity {
    const contact = this.getContactById(id);
    const updated = this.db.update<ContactEntity>(this.TABLE_NAME, id, { lifecycleStage: stage });
    this.logger.info('ContactService', `Updated lifecycle stage for contact '${id}' to ${stage}`);
    this.eventBus.publish('contact.lifecycle_changed', { contact: updated, previousStage: contact.lifecycleStage }, updated.tenantId);
    return updated;
  }

  public queryContacts(options: QueryOptions = {}): PaginatedResult<ContactEntity> {
    return this.db.query<ContactEntity>(this.TABLE_NAME, options);
  }
}
