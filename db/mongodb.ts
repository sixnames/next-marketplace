import { MongoClient, Db } from 'mongodb';
import path from 'path';

// Create cached connection variable
let cachedDb: Db | undefined;
const tlsCAFile = path.join(process.cwd(), 'db', 'root.crt');

export async function getDatabase(): Promise<Db> {
  // If the database connection is cached, use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGO_URL;
  const dbName = process.env.MONGO_DB_NAME;

  if (!uri || !dbName) {
    throw new Error('Unable to connect to database, no URI provided');
  }

  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsCAFile,
    replicaSet: process.env.MONGO_DB_RS,
    authSource: process.env.MONGO_DB_NAME,
  };

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(uri, options);

  // Select the database through the connection
  const db = await client.db(dbName);

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}
