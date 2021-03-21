import { MongoClient, Db } from 'mongodb';
import path from 'path';

// Create cached connection variable
let cachedDb: Db | undefined;

// A function for connecting to MongoDB,
// taking a single parameter of the connection string
export async function getDatabase(): Promise<Db> {
  // If the database connection is cached,
  // use it instead of creating a new connection
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGO_URL;
  if (!uri) {
    throw new Error('Unable to connect to database, no URI provided');
  }

  // If no connection is cached, create a new one
  const client = await MongoClient.connect(
    uri,
    process.env.NEXT_NODE_ENV === 'production'
      ? {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          tls: true,
          tlsCAFile: path.join(process.cwd(), 'db/ca-certificates/Yandex/root.crt'),
          replicaSet: process.env.MONGO_DB_RS,
          authSource: process.env.MONGO_DB_NAME,
        }
      : {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
  );

  // Select the database through the connection
  const db = await client.db(process.env.MONGO_DB_NAME);

  // Cache the database connection and return the connection
  cachedDb = db;
  return db;
}
