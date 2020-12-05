import mongoose from 'mongoose';
import { DB_OPTIONS } from '../config';

beforeAll(async () => {
  jest.setTimeout(30000);
  await mongoose.connect(`${process.env.MONGO_URL}`, DB_OPTIONS);
});

afterAll(async () => {
  await mongoose.disconnect();
});
