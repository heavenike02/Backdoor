export type UserRoles = {
  ANON: 'anon';
  ADMIN: 'admin';
  USER: 'user';
};

export type UserRole = UserRoles[keyof UserRoles];

export type UserType = {
  LANDLORD: 'landlord',
  TENANT: 'tenant',
}

export type UserType = UserTypes[keyof UserTypes];
