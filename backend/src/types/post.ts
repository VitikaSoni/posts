import { Document, Types } from "mongoose";
import { IUser, IUserDocument } from "./user";

export interface IFileMetadata {
  name: string;
  type: string;
}

export interface IPost {
  title: string;
  content: string;
  author: Types.ObjectId | IUserDocument;
  status: "draft" | "published" | "archived";
  fileMetadata?: IFileMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPostDocument extends IPost, Document {}

export interface CreatePostRequest {
  title: string;
  content: string;
  status?: "draft" | "published" | "archived";
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  status?: "draft" | "published" | "archived";
}

export interface PostQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  filter?: "all" | "my";
}

export interface PostResponse {
  posts: IPostDocument[];
  totalPages: number;
  currentPage: number;
  total: number;
}
