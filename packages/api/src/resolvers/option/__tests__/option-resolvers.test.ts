import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  createTestOptions,
  CreateTestOptionsInterface,
} from '../../../utils/testUtils/createTestOptions';

describe('Options', () => {
  let mockData: CreateTestOptionsInterface;
  beforeEach(async () => {
    mockData = await createTestOptions();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return current option', async () => {
    const { query } = await authenticatedTestClient();

    const {
      data: { getOption },
    } = await query<any>(
      gql`
        query GetOption($id: ID!) {
          getOption(id: $id) {
            id
            nameString
          }
        }
      `,
      {
        variables: {
          id: mockData.optionsVintage[0].id,
        },
      },
    );

    expect(getOption.id).toEqual(mockData.optionsVintage[0].id);
  });
});
