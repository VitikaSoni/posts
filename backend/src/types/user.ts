import { Document } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser {
  name: string;
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserRequest {
  password?: string;
  role?: UserRole;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface ProfileResponse {
  name: string;
  username: string;
  role: UserRole;
}

export interface UpdateProfileRequest {
  name: string;
}
