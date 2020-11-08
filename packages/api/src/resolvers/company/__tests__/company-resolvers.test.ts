import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { MOCK_COMPANIES } from '@yagu/mocks';
import { gql } from 'apollo-server-express';

describe('Company', () => {
  it('Should CRUD companies', async () => {
    const { query } = await authenticatedTestClient();

    // Should return companies list
    const {
      data: { getAllCompanies },
    } = await query<any>(
      gql`
        query GetAllCompanies {
          getAllCompanies {
            id
            nameString
            slug
          }
        }
      `,
    );
    expect(getAllCompanies).toHaveLength(MOCK_COMPANIES.length);
  });
});
