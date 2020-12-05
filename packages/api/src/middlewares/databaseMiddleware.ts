import mongoose from 'mongoose';
import { DB_OPTIONS, MONGO_URL } from '../config';
import createInitialData from '../utils/initialData/createInitialData';

// Mongoose connection
let connection: mongoose.Connection;
const connectMongo = async () => {
  try {
    if (!connection) {
      await mongoose.connect(`${MONGO_URL}`, DB_OPTIONS);
      connection = mongoose.connection;
    }
  } catch (e) {
    console.log('============ Mongoose connection error ============');
    console.log(e);
  }
};

export const databaseMiddleware = async (req: any, _res: any, next: any) => {
  await connectMongo();

  // Create initial data
  await createInitialData();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  req.dbClient = connection.client;
  return next();
};
