import { gql } from 'apollo-server-express';
import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import getLangField from '../../../utils/translations/getLangField';
import { CATALOGUE_BRAND_KEY, DEFAULT_LANG } from '@yagu/shared';

describe('Catalogue', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should return catalogue nav', async () => {
    const { query } = await testClientWithContext();

    const rubricNavItemsPayload = await query<any>(
      gql`
        query GetRubric($slug: String!) {
          getRubricBySlug(slug: $slug) {
            id
            navItems {
              id
              isDisabled
              attributes {
                id
                isDisabled
                visibleOptions {
                  id
                  slug
                  nameString
                  isDisabled
                }
                hiddenOptions {
                  id
                  slug
                  nameString
                  isDisabled
                }
                options {
                  id
                  slug
                  nameString
                  isDisabled
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          slug: mockData.rubricLevelOneA.slug,
        },
      },
    );
    expect(rubricNavItemsPayload).toBeDefined();
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
              catalogueFilter {
                attributes {
                  id
                  clearSlug
                  isSelected
                  node {
                    id
                    nameString
                  }
                  options {
                    id
                    slug
                    filterNameString
                    color
                    counter
                    optionSlug
                    optionNextSlug
                    isSelected
                    isDisabled
                    color
                  }
                }
                selectedAttributes {
                  id
                  clearSlug
                  isSelected
                  node {
                    id
                    nameString
                  }
                  options {
                    id
                    slug
                    filterNameString
                    color
                    counter
                    optionSlug
                    optionNextSlug
                    isSelected
                    isDisabled
                    color
                  }
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
            mockData.rubricLevelOneA.slug,
            `${mockData.attributeWineColor.slug}-krasniy`,
            `${mockData.attributeWineType.slug}-vermut`,
            `${CATALOGUE_BRAND_KEY}-${mockData.brandA.slug}`,
          ],
        },
      },
    );
    //
    expect(getCatalogueData.products.docs).toHaveLength(1);
    expect(getCatalogueData.rubric.catalogueFilter.attributes).toHaveLength(2);
    expect(getCatalogueData.rubric.catalogueFilter.selectedAttributes).toHaveLength(2);
    expect(getCatalogueData.rubric.catalogueFilter.selectedAttributes[0].options).toHaveLength(1);
    expect(getCatalogueData.rubric.catalogueFilter.selectedAttributes[1].options).toHaveLength(1);
    expect(getCatalogueData.catalogueTitle).toEqual('Купить красный вермут');
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
          search: getLangField(mockData.rubricLevelOneA.name, DEFAULT_LANG),
        },
      },
    );
    expect(getCatalogueSearchResultPayloadA.data.getCatalogueSearchResult.products).toBeDefined();
    expect(getCatalogueSearchResultPayloadA.data.getCatalogueSearchResult.rubrics).toBeDefined();
  });
});
