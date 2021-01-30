import { clearTestData } from 'tests/clearTestData';
import { createTestShops, CreateTestShopsPayloadInterface } from 'tests/createTestShops';

export type CreateTestDataPayloadInterface = CreateTestShopsPayloadInterface;

export const createTestData = async (): Promise<CreateTestDataPayloadInterface> => {
  await clearTestData();
  return createTestShops();
};
