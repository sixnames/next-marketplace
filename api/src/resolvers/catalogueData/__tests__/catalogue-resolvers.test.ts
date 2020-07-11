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
              attributesGroups {
                id
                node {
                  id
                  nameString
                  attributes {
                    nameString
                    filterOptions(
                      filter: [
                        "wine"
                        "attribute_multiple-gray"
                        "attribute_multiple-red"
                      ]
                    ) {
                      option {
                        id
                      }
                      counter
                    }
                  }
                }
                showInCatalogueFilter
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

    console.log(JSON.stringify(getCatalogueData, null, 2));

    expect(getCatalogueData.products.docs).toHaveLength(2);
  });
});
