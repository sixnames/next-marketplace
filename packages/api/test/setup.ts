import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { DB_OPTIONS } from '../src/config';
import createApp from '../src/app';
import { createTestClient } from 'apollo-server-integration-testing';
import createTestData from '../src/utils/test-data/createTestData';
import clearTestData from '../src/utils/test-data/clearTestData';

const { server } = createApp();

export const testClient = createTestClient({
  apolloServer: server,
});

let mongod: MongoMemoryServer;
beforeAll(async () => {
  jest.setTimeout(10000);
  mongod = new MongoMemoryServer();
  const uri = await mongod.getConnectionString();
  await mongoose.connect(uri, DB_OPTIONS);
});

beforeEach(async () => {
  await createTestData();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  await clearTestData();
});
