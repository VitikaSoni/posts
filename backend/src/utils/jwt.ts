import jwt from "jsonwebtoken";
import { IUserDocument } from "../types/user";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export const createAccessToken = (user: IUserDocument) => {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    } as jwt.SignOptions
  );
};

export const createRefreshToken = (user: IUserDocument) => {
  return jwt.sign(
    { userId: user._id, username: user.username, role: user.role },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    } as jwt.SignOptions
  );
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, ACCESS_TOKEN_SECRET);
export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, REFRESH_TOKEN_SECRET);
