import { getTestClientWithUser } from '../../../utils/testUtils/testHelpers';

describe('Attributes', () => {
  it('Should return current attribute', async () => {
    const { query } = await getTestClientWithUser({});

    const {
      data: { getCatalogueData },
    } = await query(
      `
        query GetCatalogueData($catalogueFilter: [String!]!) {
          getCatalogueData(catalogueFilter: $catalogueFilter) {
            rubric {
              id
              name
              filterAttributes {
                nameString
                filterOptions(filter: $catalogueFilter) {
                  option {
                    id
                  }
                  counter
                }
              }
            }
            products {
              docs {
                id
                name
              }
              page
            }
          }
        }
      `,
      {
        variables: {
          catalogueFilter: ['wine', 'attribute_multiple-gray', 'attribute_multiple-red'],
        },
      },
    );
    expect(getCatalogueData.products.docs).toHaveLength(2);
    expect(getCatalogueData.filterAttributes).toHaveLength(2);
  });
});
