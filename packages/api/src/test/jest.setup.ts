import mongoose from 'mongoose';
// import { DB_OPTIONS } from '../src/config';
import createApp from '../app';
import { createTestClient, TestQuery, TestSetOptions } from 'apollo-server-integration-testing';

export let testClient: {
  query: TestQuery;
  mutate: TestQuery;
  setOptions: TestSetOptions;
};

beforeAll(async () => {
  jest.setTimeout(30000);
  const { server } = await createApp();

  testClient = createTestClient({
    apolloServer: server,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});
