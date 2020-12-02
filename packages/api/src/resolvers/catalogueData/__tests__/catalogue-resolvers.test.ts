import { gql } from 'apollo-server-express';
import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { MOCK_PRODUCT_A } from '@yagu/mocks';
import getLangField from '../../../utils/translations/getLangField';
import { DEFAULT_LANG } from '@yagu/config';

describe('Catalogue', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return catalogue data', async () => {
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

  it('Should return search result', async () => {
    const { query } = await testClientWithContext();

    const getCatalogueSearchTopItemsPayload = await query<any>(
      gql`
        query GetCatalogueSearchTopItems {
          getCatalogueSearchTopItems {
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
    );
    const {
      data: { getCatalogueSearchTopItems },
    } = getCatalogueSearchTopItemsPayload;
    expect(getCatalogueSearchTopItems.products).toHaveLength(3);
    expect(getCatalogueSearchTopItems.rubrics).toHaveLength(3);

    const getCatalogueSearchResultPayloadA = await query<any>(
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
    expect(getCatalogueSearchResultPayloadA.data.getCatalogueSearchResult.products).toHaveLength(0);
    expect(getCatalogueSearchResultPayloadA.data.getCatalogueSearchResult.rubrics).toHaveLength(1);

    const getCatalogueSearchResultPayloadB = await query<any>(
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
          search: getLangField(MOCK_PRODUCT_A.cardName, DEFAULT_LANG),
        },
      },
    );
    expect(getCatalogueSearchResultPayloadB.data.getCatalogueSearchResult.products).toHaveLength(1);
    expect(getCatalogueSearchResultPayloadB.data.getCatalogueSearchResult.rubrics).toHaveLength(0);
  });
});
