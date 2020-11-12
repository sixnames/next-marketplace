import { createTestCompanies, CreateTestCompaniesPayloadInterface } from './createTestCompanies';

export type CreateTestDataPayloadInterface = CreateTestCompaniesPayloadInterface;

const createTestData = async (): Promise<CreateTestDataPayloadInterface> => {
  return createTestCompanies();
};

export default createTestData;
