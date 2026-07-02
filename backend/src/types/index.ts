export interface JwtPayload {
  userId: string;
  email: string;
  roleId: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest {
  userId: string;
  email: string;
  roleId: string;
  role?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ELECTION_ADMIN = 'ELECTION_ADMIN',
  VOTER = 'VOTER'
}

export enum ElectionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
