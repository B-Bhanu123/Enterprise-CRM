import { BaseEntity, ISOString } from '../../core/types/common.types.js';

export enum UserRole {
  ADMIN = 'ADMIN',
  SALES_MANAGER = 'SALES_MANAGER',
  SALES_REP = 'SALES_REP',
  SUPPORT_AGENT = 'SUPPORT_AGENT',
  MARKETING_MANAGER = 'MARKETING_MANAGER',
  VIEWER = 'VIEWER'
}

export enum Permission {
  // Lead Permissions
  LEADS_READ = 'leads:read',
  LEADS_CREATE = 'leads:create',
  LEADS_UPDATE = 'leads:update',
  LEADS_DELETE = 'leads:delete',
  LEADS_ASSIGN = 'leads:assign',

  // Contact Permissions
  CONTACTS_READ = 'contacts:read',
  CONTACTS_CREATE = 'contacts:create',
  CONTACTS_UPDATE = 'contacts:update',
  CONTACTS_DELETE = 'contacts:delete',

  // Deal & Pipeline Permissions
  DEALS_READ = 'deals:read',
  DEALS_CREATE = 'deals:create',
  DEALS_UPDATE = 'deals:update',
  DEALS_DELETE = 'deals:delete',
  DEALS_FORECAST = 'deals:forecast',

  // Ticket & Support Permissions
  TICKETS_READ = 'tickets:read',
  TICKETS_CREATE = 'tickets:create',
  TICKETS_UPDATE = 'tickets:update',
  TICKETS_DELETE = 'tickets:delete',
  TICKETS_ASSIGN = 'tickets:assign',

  // Campaign Permissions
  CAMPAIGNS_READ = 'campaigns:read',
  CAMPAIGNS_MANAGE = 'campaigns:manage',

  // Workflow Permissions
  WORKFLOWS_READ = 'workflows:read',
  WORKFLOWS_MANAGE = 'workflows:manage',

  // Analytics Permissions
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',

  // System & User Permissions
  USERS_MANAGE = 'users:manage',
  SETTINGS_MANAGE = 'settings:manage'
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: Object.values(Permission),

  [UserRole.SALES_MANAGER]: [
    Permission.LEADS_READ, Permission.LEADS_CREATE, Permission.LEADS_UPDATE, Permission.LEADS_DELETE, Permission.LEADS_ASSIGN,
    Permission.CONTACTS_READ, Permission.CONTACTS_CREATE, Permission.CONTACTS_UPDATE, Permission.CONTACTS_DELETE,
    Permission.DEALS_READ, Permission.DEALS_CREATE, Permission.DEALS_UPDATE, Permission.DEALS_DELETE, Permission.DEALS_FORECAST,
    Permission.TICKETS_READ,
    Permission.ANALYTICS_VIEW, Permission.ANALYTICS_EXPORT
  ],

  [UserRole.SALES_REP]: [
    Permission.LEADS_READ, Permission.LEADS_CREATE, Permission.LEADS_UPDATE,
    Permission.CONTACTS_READ, Permission.CONTACTS_CREATE, Permission.CONTACTS_UPDATE,
    Permission.DEALS_READ, Permission.DEALS_CREATE, Permission.DEALS_UPDATE,
    Permission.TICKETS_READ, Permission.TICKETS_CREATE,
    Permission.ANALYTICS_VIEW
  ],

  [UserRole.SUPPORT_AGENT]: [
    Permission.CONTACTS_READ, Permission.CONTACTS_UPDATE,
    Permission.TICKETS_READ, Permission.TICKETS_CREATE, Permission.TICKETS_UPDATE, Permission.TICKETS_ASSIGN,
    Permission.ANALYTICS_VIEW
  ],

  [UserRole.MARKETING_MANAGER]: [
    Permission.LEADS_READ, Permission.LEADS_CREATE, Permission.LEADS_UPDATE,
    Permission.CONTACTS_READ,
    Permission.CAMPAIGNS_READ, Permission.CAMPAIGNS_MANAGE,
    Permission.ANALYTICS_VIEW, Permission.ANALYTICS_EXPORT
  ],

  [UserRole.VIEWER]: [
    Permission.LEADS_READ,
    Permission.CONTACTS_READ,
    Permission.DEALS_READ,
    Permission.TICKETS_READ,
    Permission.ANALYTICS_VIEW
  ]
};

export interface UserEntity extends BaseEntity {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  isActive: boolean;
  lastLoginAt?: ISOString;
  customPermissions?: Permission[];
}

export interface UserDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  tenantId?: string;
  isActive: boolean;
  lastLoginAt?: ISOString;
  permissions: Permission[];
}
