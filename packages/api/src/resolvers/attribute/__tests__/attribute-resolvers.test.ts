import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  createTestAttributes,
  CreateTestAttributesPayloadInterface,
} from '../../../utils/testUtils/createTestAttributes';

describe('Attributes', () => {
  let mockData: CreateTestAttributesPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestAttributes();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return current attribute', async () => {
    const { query } = await authenticatedTestClient();
    const { data } = await query<any>(
      gql`
        query GetAttribute($id: ID!) {
          getAttribute(id: $id) {
            id
            nameString
            variant
          }
        }
      `,
      {
        variables: {
          id: mockData.attributeNumber.id,
        },
      },
    );

    expect(data.getAttribute.id).toEqual(mockData.attributeNumber.id);
  });
});
