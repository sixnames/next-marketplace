import mongoose from 'mongoose';
// import { DB_OPTIONS } from '../src/config';
import createApp from '../app';
import { createTestClient, TestQuery, TestSetOptions } from 'apollo-server-integration-testing';
import createTestData from '../utils/testUtils/createTestData';
import clearTestData from '../utils/testUtils/clearTestData';

export let testClient: {
  query: TestQuery;
  mutate: TestQuery;
  setOptions: TestSetOptions;
};

beforeAll(async () => {
  jest.setTimeout(10000);
  const { server } = await createApp();

  testClient = createTestClient({
    apolloServer: server,
  });
});

beforeEach(async () => {
  await createTestData();
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  await clearTestData();
});
