import mongoose, { Schema } from "mongoose";
import { IComment, ICommentDocument } from "../types/comment";

const commentSchema = new Schema<ICommentDocument>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
commentSchema.index({ post: 1, createdAt: -1 });

export default mongoose.model<ICommentDocument>("Comment", commentSchema);
