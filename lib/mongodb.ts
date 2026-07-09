import { MongoClient, type Db } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  minPoolSize: 2,
};

/**
 * Global cached MongoDB client.
 * The MongoClient constructor is synchronous — actual connection happens lazily on first query.
 * Using globalThis to persist across hot reloads in development.
 */
interface MongoCache {
  client: MongoClient;
  db: Db;
}

declare global {
  // eslint-disable-next-line no-var
  var __mongoCache: MongoCache | undefined;
}

function getOrCreateCache(): MongoCache {
  if (global.__mongoCache) return global.__mongoCache;

  const client = new MongoClient(uri, options);
  const db = client.db();
  global.__mongoCache = { client, db };
  return global.__mongoCache;
}

export function getMongoClient(): MongoClient {
  return getOrCreateCache().client;
}

export function getDb(): Db {
  return getOrCreateCache().db;
}
