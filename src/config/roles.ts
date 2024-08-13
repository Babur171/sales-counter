import { Role } from '@prisma/client';

const allRoles = {
  [Role.USER]: [`getUsers`],
  [Role.ADMIN]: ['getUsers', 'manageUsers']
};

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));
