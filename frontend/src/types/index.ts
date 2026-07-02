export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  lastLogin?: Date;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface Election {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  isPublic: boolean;
  adminId: string;
}

export interface Position {
  id: string;
  title: string;
  description?: string;
  order: number;
  maxVotes: number;
  electionId: string;
  candidates: Candidate[];
}

export interface Candidate {
  id: string;
  name: string;
  bio?: string;
  photo?: string;
  positionId: string;
  order: number;
}

export interface Vote {
  id: string;
  voterId: string;
  electionId: string;
  candidateId: string;
  positionId: string;
  timestamp: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
