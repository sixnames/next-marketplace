import { testClientWithContext } from '../../../utils/testUtils/testHelpers';

describe('Attributes', () => {
  it('Should return current attribute', async () => {
    const { query } = await testClientWithContext({});

    const {
      data: { getCatalogueData },
    } = await query(
      `
        query GetCatalogueData($catalogueFilter: [String!]!) {
          getCatalogueData(catalogueFilter: $catalogueFilter) {
            catalogueTitle
            rubric {
              id
              nameString
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
                nameString
              }
              page
            }
          }
        }
      `,
      {
        variables: {
          catalogueFilter: [
            'kupit_vino',
            'tsvet_vina-krasniy',
            'tsvet_vina-beliy',
            'tip_vina-portvein',
            'tip_vina-kreplenoe',
          ],
        },
      },
    );

    expect(getCatalogueData.products.docs).toHaveLength(1);
    expect(getCatalogueData.rubric.filterAttributes).toHaveLength(2);
    expect(getCatalogueData.catalogueTitle).toEqual(
      'Купить белый или красный портвейн или крепленое',
    );
  });
});
