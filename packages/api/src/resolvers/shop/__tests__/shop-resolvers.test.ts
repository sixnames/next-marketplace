import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import { MOCK_COMPANY, MOCK_SHOPS, MOCK_SHOP } from '@yagu/mocks';

describe('Shop', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD shops', async () => {
    const { query } = await authenticatedTestClient();

    // Should return shops list
    const {
      data: { getAllShops },
    } = await query<any>(
      gql`
        query GetAllShops {
          getAllShops {
            id
            nameString
            slug
            company {
              id
              nameString
              slug
            }
          }
        }
      `,
    );
    const currentShop = getAllShops.find(({ slug }: any) => slug === MOCK_SHOP.slug);
    if (!currentShop) {
      throw Error('Test shop not found');
    }
    expect(getAllShops).toHaveLength(MOCK_SHOPS.length);
    expect(currentShop.company.nameString).toEqual(MOCK_COMPANY.nameString);

    // Should return shop by ID
    const {
      data: { getShop },
    } = await query<any>(
      gql`
        query GetShop($id: ID!) {
          getShop(id: $id) {
            id
            nameString
            slug
            company {
              id
              nameString
              slug
            }
          }
        }
      `,
      {
        variables: {
          id: currentShop.id,
        },
      },
    );
    expect(getShop.id).toEqual(currentShop.id);
  });
});
