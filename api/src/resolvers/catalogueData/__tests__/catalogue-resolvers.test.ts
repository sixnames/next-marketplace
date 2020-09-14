import { gql } from 'apollo-server-express';
import { testClientWithContext } from '../../../utils/testUtils/testHelpers';

describe('Catalogue', () => {
  it.only('Should return catalogue data', async () => {
    const { query } = await testClientWithContext();

    const {
      data: { getCatalogueData },
    } = await query<any>(
      gql`
        query GetCatalogueData($catalogueFilter: [String!]!) {
          getCatalogueData(catalogueFilter: $catalogueFilter) {
            catalogueTitle
            rubric {
              id
              nameString
              filterAttributes {
                id
                node {
                  id
                  nameString
                  slug
                }
                options {
                  id
                  slug
                  filterNameString
                  color
                  counter
                  color
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
            // 'tsvet_vina-krasniy',
            // 'tsvet_vina-beliy',
            // 'tip_vina-portvein',
            // 'tip_vina-kreplenoe',
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

  it('Should return search result', async () => {
    const { query } = await testClientWithContext();

    /*const {
      data: { getCatalogueSearchResult },
    } =*/ await query<any>(
      gql`
        query GetCatalogueSearchResult($search: String!) {
          getCatalogueSearchResult(search: $search) {
            rubrics {
              id
              nameString
            }
            products {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          search: 'Вино',
        },
      },
    );
    // expect(getCatalogueSearchResult.rubrics).toHaveLength(1);
    // expect(getCatalogueSearchResult.products).toHaveLength(2);
  });
});
