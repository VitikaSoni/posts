import { Document, Types } from "mongoose";
import { IUser, IUserDocument } from "./user";

export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId | IUserDocument;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends IPost, Document {}

export interface CreatePostRequest {
  title: string;
  content: string;
  author: Types.ObjectId | IUserDocument;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PostResponse {
  posts: IPostDocument[];
  totalPages: number;
  currentPage: number;
  total: number;
}
