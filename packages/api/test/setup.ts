import mongoose from 'mongoose';
import { DB_OPTIONS } from '../src/config';
import createApp from '../src/app';
import { createTestClient } from 'apollo-server-integration-testing';
import createTestData from '../src/utils/testUtils/createTestData';
import clearTestData from '../src/utils/testUtils/clearTestData';
import { UserModel } from '../src/entities/User';

const { server } = createApp();

export const testClient = createTestClient({
  apolloServer: server,
});

beforeAll(async () => {
  jest.setTimeout(10000);
  await mongoose.connect(`${process.env.MONGO_URL}`, DB_OPTIONS);
});

beforeEach(async () => {
  await createTestData();
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await clearTestData();
  await UserModel.deleteMany({});
});
