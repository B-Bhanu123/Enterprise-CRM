"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_service_js_1 = require("../src/modules/auth/auth.service.js");
const user_model_js_1 = require("../src/modules/auth/user.model.js");
const rbac_middleware_js_1 = require("../src/modules/auth/rbac.middleware.js");
const app_error_js_1 = require("../src/core/errors/app.error.js");
describe('Test Case 2: RBAC Security & Permission Matrix Verification', () => {
    const authService = auth_service_js_1.AuthService.getInstance();
    it('should grant full admin permissions to ADMIN role users', () => {
        const hasManageUsers = authService.hasPermission(user_model_js_1.UserRole.ADMIN, user_model_js_1.Permission.USERS_MANAGE);
        const hasForecastDeals = authService.hasPermission(user_model_js_1.UserRole.ADMIN, user_model_js_1.Permission.DEALS_FORECAST);
        expect(hasManageUsers).toBe(true);
        expect(hasForecastDeals).toBe(true);
    });
    it('should restrict SALES_REP from managing system settings or users', () => {
        const hasManageUsers = authService.hasPermission(user_model_js_1.UserRole.SALES_REP, user_model_js_1.Permission.USERS_MANAGE);
        const hasManageSettings = authService.hasPermission(user_model_js_1.UserRole.SALES_REP, user_model_js_1.Permission.SETTINGS_MANAGE);
        expect(hasManageUsers).toBe(false);
        expect(hasManageSettings).toBe(false);
    });
    it('should throw ForbiddenError when user lacks required permission in RBAC middleware', () => {
        const salesRepPayload = {
            userId: 'rep_123',
            email: 'rep@company.com',
            role: user_model_js_1.UserRole.SALES_REP,
            permissions: []
        };
        expect(() => {
            rbac_middleware_js_1.RBACMiddleware.authorize(user_model_js_1.Permission.USERS_MANAGE, salesRepPayload);
        }).toThrow(app_error_js_1.ForbiddenError);
    });
});
