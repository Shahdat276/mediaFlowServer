import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, bearer } from "better-auth/plugins";
import { getMongoClient, getDb } from "./mongodb";

const client = getMongoClient();
const db = getDb();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    disableOriginCheck: true,
  },
  plugins: [
    admin(),
    bearer()
  ],
});
export type Auth = typeof auth;
