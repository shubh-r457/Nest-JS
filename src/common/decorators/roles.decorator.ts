import { SetMetadata } from '@nestjs/common';

/**
 * Custom decorator for defining required roles
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
