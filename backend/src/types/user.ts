import { Document } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser {
  username: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {}

export interface CreateUserRequest {
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
