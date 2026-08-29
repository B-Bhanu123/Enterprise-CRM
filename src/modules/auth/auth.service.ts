import { MemoryDatabase } from '../../core/database/memory.db.js';
import { CryptoUtils } from '../../core/utils/crypto.utils.ts';
import { ValidatorUtils } from '../../core/utils/validator.utils.ts';
import { AuthenticationError, ConflictError, ForbiddenError, NotFoundError, ValidationError } from '../../core/errors/app.error.js';
import { Permission, ROLE_PERMISSIONS, UserDTO, UserEntity, UserRole } from './user.model.js';
import { LoggerService } from '../../core/logger/logger.service.js';

export interface RegisterDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  tenantId?: string;
  department?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  permissions: Permission[];
}

export class AuthService {
  private static instance: AuthService;
  private db = MemoryDatabase.getInstance();
  private logger = LoggerService.getInstance();
  private readonly TABLE_NAME = 'users';

  private constructor() {
    this.seedInitialAdmin();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private seedInitialAdmin(): void {
    const existingAdmin = this.db.query<UserEntity>(this.TABLE_NAME, {
      filters: [{ field: 'email', operator: 'eq', value: 'admin@enterprisecrm.com' }]
    });

    if (existingAdmin.total === 0) {
      const adminId = CryptoUtils.generateUUID();
      this.db.insert<UserEntity>(this.TABLE_NAME, {
        id: adminId,
        email: 'admin@enterprisecrm.com',
        passwordHash: CryptoUtils.hashPassword('AdminSecret123!'),
        firstName: 'System',
        lastName: 'Administrator',
        role: UserRole.ADMIN,
        department: 'Executive',
        isActive: true,
        tenantId: 'tenant_default',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      this.logger.info('AuthService', 'Default administrator account seeded');
    }
  }

  public register(dto: RegisterDTO): UserDTO {
    if (!ValidatorUtils.isValidEmail(dto.email)) {
      throw new ValidationError('Invalid email format provided');
    }
    if (!dto.password || dto.password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    const existing = this.db.query<UserEntity>(this.TABLE_NAME, {
      filters: [{ field: 'email', operator: 'eq', value: dto.email.toLowerCase() }]
    });

    if (existing.total > 0) {
      throw new ConflictError(`User with email '${dto.email}' already exists`);
    }

    const role = dto.role || UserRole.SALES_REP;
    const userId = CryptoUtils.generateUUID();
    const newUser: UserEntity = {
      id: userId,
      email: dto.email.toLowerCase(),
      passwordHash: CryptoUtils.hashPassword(dto.password),
      firstName: ValidatorUtils.sanitizeString(dto.firstName),
      lastName: ValidatorUtils.sanitizeString(dto.lastName),
      role,
      department: dto.department || 'Sales',
      tenantId: dto.tenantId || 'tenant_default',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = this.db.insert<UserEntity>(this.TABLE_NAME, newUser);
    return this.toDTO(saved);
  }

  public login(dto: LoginDTO): { user: UserDTO; token: string } {
    const result = this.db.query<UserEntity>(this.TABLE_NAME, {
      filters: [{ field: 'email', operator: 'eq', value: dto.email.toLowerCase() }]
    });

    if (result.total === 0) {
      throw new AuthenticationError('Invalid email or password');
    }

    const user = result.data[0];

    if (!user.isActive) {
      throw new ForbiddenError('User account has been deactivated');
    }

    if (!CryptoUtils.verifyPassword(dto.password, user.passwordHash)) {
      throw new AuthenticationError('Invalid email or password');
    }

    // Update last login
    this.db.update<UserEntity>(this.TABLE_NAME, user.id, {
      lastLoginAt: new Date().toISOString()
    });

    const userDTO = this.toDTO(user);
    const token = this.generateSessionToken(userDTO);

    this.logger.info('AuthService', `User logged in: ${user.email}`);

    return { user: userDTO, token };
  }

  public generateSessionToken(user: UserDTO): string {
    const payload: AuthTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      permissions: user.permissions
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  }

  public verifySessionToken(token: string): AuthTokenPayload {
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const payload: AuthTokenPayload = JSON.parse(decoded);
      return payload;
    } catch {
      throw new AuthenticationError('Invalid or expired authentication token');
    }
  }

  public getUserById(userId: string): UserDTO {
    const user = this.db.findById<UserEntity>(this.TABLE_NAME, userId);
    if (!user) {
      throw new NotFoundError('User', userId);
    }
    return this.toDTO(user);
  }

  public hasPermission(userRole: UserRole, permission: Permission, customPermissions?: Permission[]): boolean {
    const basePermissions = ROLE_PERMISSIONS[userRole] || [];
    const allPermissions = [...basePermissions, ...(customPermissions || [])];
    return allPermissions.includes(permission);
  }

  private toDTO(user: UserEntity): UserDTO {
    const permissions = Array.from(
      new Set([...(ROLE_PERMISSIONS[user.role] || []), ...(user.customPermissions || [])])
    );

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      department: user.department,
      tenantId: user.tenantId,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      permissions
    };
  }
}
