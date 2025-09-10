import mongoose, { Schema } from "mongoose";
import { IPost, IPostDocument } from "../types/post";

const postSchema = new Schema<IPostDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

postSchema.index({ title: "text", content: "text" });

export default mongoose.model<IPostDocument>("Post", postSchema);
