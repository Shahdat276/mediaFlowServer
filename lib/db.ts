import { getMongoClient, getDb } from "./mongodb";

/**
 * Database connection helper.
 * Re-exports the shared MongoDB client for backward compatibility.
 * Use getMongoClient() or getDb() directly from "./mongodb" for new code.
 */
export default function dbConnect() {
  return {
    client: getMongoClient(),
    db: getDb(),
    connection: { readyState: 1 }, // 1 = connected
  };
}
