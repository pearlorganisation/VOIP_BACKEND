import dotenv from "dotenv";
dotenv.config();

export const DB_NAME = "Voip_DB";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENVIRONMENT !== "development",
};
