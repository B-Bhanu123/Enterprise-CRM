import { AuthService } from './auth.service.js';
import { Permission } from './user.model.js';
import { AuthenticationError, ForbiddenError } from '../../core/errors/app.error.js';

export class RBACMiddleware {
  private static authService = AuthService.getInstance();

  public static authenticate(authorizationHeader?: string) {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing or malformed Authorization header');
    }

    const token = authorizationHeader.substring(7);
    return this.authService.verifySessionToken(token);
  }

  public static authorize(permission: Permission, tokenPayload: any) {
    if (!tokenPayload) {
      throw new AuthenticationError('User session context missing');
    }

    const hasAccess = this.authService.hasPermission(tokenPayload.role, permission);

    if (!hasAccess) {
      throw new ForbiddenError(`Action forbidden: Requires permission '${permission}'`);
    }

    return true;
  }
}
