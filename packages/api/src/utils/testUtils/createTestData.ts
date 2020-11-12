import { createTestCompanies, CreateTestCompaniesPayloadInterface } from './createTestCompanies';

type CreateTestDataPayloadInterface = CreateTestCompaniesPayloadInterface;

const createTestData = async (): Promise<CreateTestDataPayloadInterface> => {
  return createTestCompanies();
};

export default createTestData;
