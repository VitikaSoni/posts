import { Document, Types } from "mongoose";
import { IUser, IUserDocument } from "./user";
import { IPost, IPostDocument } from "./post";

export interface IComment {
  content: string;
  author: Types.ObjectId | IUserDocument;
  post: Types.ObjectId | IPostDocument;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICommentDocument extends IComment, Document {}

export interface CreateCommentRequest {
  content: string;
}

export interface CommentResponse {
  comments: ICommentDocument[];
}
