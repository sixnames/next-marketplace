import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import * as faker from 'faker';

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
    const brandCollectionB = mockData.brandCollectionB;
    const { query, mutate } = await authenticatedTestClient();

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
        query GetBrandCollectionBySlug($slug: String!) {
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
        query GetAllBrandCollections($input: BrandCollectionPaginateInput) {
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

    // Shouldn't update brand collection on duplicate error
    const updateBrandCollectionDuplicatePayload = await mutate<any>(
      gql`
        mutation UpdateBrandCollection($input: UpdateBrandCollectionInput!) {
          updateBrandCollection(input: $input) {
            success
            message
            collection {
              id
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: brandCollectionA.id,
            nameString: brandCollectionB.nameString,
            description: brandCollectionB.description,
          },
        },
      },
    );
    expect(updateBrandCollectionDuplicatePayload.data.updateBrandCollection.success).toBeFalsy();

    // Should update brand collection
    const updatedCollectionName = faker.lorem.words(2);
    const updatedCollectionDescription = faker.lorem.paragraph();
    const updateBrandCollectionPayload = await mutate<any>(
      gql`
        mutation UpdateBrandCollection($input: UpdateBrandCollectionInput!) {
          updateBrandCollection(input: $input) {
            success
            message
            collection {
              id
              nameString
              description
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: brandCollectionA.id,
            nameString: updatedCollectionName,
            description: updatedCollectionDescription,
          },
        },
      },
    );
    expect(updateBrandCollectionPayload.data.updateBrandCollection.success).toBeTruthy();
    expect(updateBrandCollectionPayload.data.updateBrandCollection.collection.nameString).toEqual(
      updatedCollectionName,
    );
    expect(updateBrandCollectionPayload.data.updateBrandCollection.collection.description).toEqual(
      updatedCollectionDescription,
    );
    expect(updateBrandCollectionPayload.data.updateBrandCollection.collection.id).toEqual(
      brandCollectionA.id,
    );
  });
});
