import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';

describe('Brand collection', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD brand collections', async () => {
    const brandCollectionA = mockData.brandCollectionA;
    const { query } = await authenticatedTestClient();

    // Should return brand collection by ID
    const getBrandCollectionPayload = await query<any>(
      gql`
        query GetBrandCollection($id: ID!) {
          getBrandCollection(id: $id) {
            id
            nameString
            slug
            description
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          id: brandCollectionA.id,
        },
      },
    );
    expect(getBrandCollectionPayload.data.getBrandCollection.id).toEqual(brandCollectionA.id);

    // Should return brand collection by ID
    const getBrandCollectionBySlugPayload = await query<any>(
      gql`
        query GetBrandCollection($slug: String!) {
          getBrandCollectionBySlug(slug: $slug) {
            id
            nameString
            slug
            description
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          slug: brandCollectionA.slug,
        },
      },
    );
    expect(getBrandCollectionBySlugPayload.data.getBrandCollectionBySlug.id).toEqual(
      brandCollectionA.id,
    );

    // Should return paginated brand collections
    const getAllBrandCollectionsPayload = await query<any>(
      gql`
        query GetBrandCollection($input: BrandCollectionPaginateInput) {
          getAllBrandCollections(input: $input) {
            page
            limit
            totalDocs
            totalPages
            sortBy
            sortDir
            hasPrevPage
            hasNextPage
            docs {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            limit: 1,
          },
        },
      },
    );
    expect(getAllBrandCollectionsPayload.data.getAllBrandCollections.totalDocs).toEqual(
      mockData.allBrandCollections.length,
    );
    expect(getAllBrandCollectionsPayload.data.getAllBrandCollections.totalPages).toEqual(
      mockData.allBrandCollections.length,
    );
    expect(getAllBrandCollectionsPayload.data.getAllBrandCollections.hasPrevPage).toBeFalsy();
    expect(getAllBrandCollectionsPayload.data.getAllBrandCollections.hasNextPage).toBeTruthy();
  });
});
