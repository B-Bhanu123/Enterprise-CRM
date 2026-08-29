import { AuthService } from '../src/modules/auth/auth.service.js';
import { Permission, UserRole } from '../src/modules/auth/user.model.js';
import { RBACMiddleware } from '../src/modules/auth/rbac.middleware.js';
import { ForbiddenError } from '../src/core/errors/app.error.js';

describe('Test Case 2: RBAC Security & Permission Matrix Verification', () => {
  const authService = AuthService.getInstance();

  it('should grant full admin permissions to ADMIN role users', () => {
    const hasManageUsers = authService.hasPermission(UserRole.ADMIN, Permission.USERS_MANAGE);
    const hasForecastDeals = authService.hasPermission(UserRole.ADMIN, Permission.DEALS_FORECAST);

    expect(hasManageUsers).toBe(true);
    expect(hasForecastDeals).toBe(true);
  });

  it('should restrict SALES_REP from managing system settings or users', () => {
    const hasManageUsers = authService.hasPermission(UserRole.SALES_REP, Permission.USERS_MANAGE);
    const hasManageSettings = authService.hasPermission(UserRole.SALES_REP, Permission.SETTINGS_MANAGE);

    expect(hasManageUsers).toBe(false);
    expect(hasManageSettings).toBe(false);
  });

  it('should throw ForbiddenError when user lacks required permission in RBAC middleware', () => {
    const salesRepPayload = {
      userId: 'rep_123',
      email: 'rep@company.com',
      role: UserRole.SALES_REP,
      permissions: []
    };

    expect(() => {
      RBACMiddleware.authorize(Permission.USERS_MANAGE, salesRepPayload);
    }).toThrow(ForbiddenError);
  });
});
