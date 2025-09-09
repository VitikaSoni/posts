import mongoose, { Schema } from "mongoose";
import { IUser, IUserDocument } from "../types/user";

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      maxLength: 60,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserDocument>("User", userSchema);
