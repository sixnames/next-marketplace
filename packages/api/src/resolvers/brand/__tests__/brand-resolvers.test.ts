import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import * as faker from 'faker';

describe('Brand', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  const brandCollectionFragment = gql`
    fragment TestBrandCollection on BrandCollection {
      id
      nameString
      slug
      description
      createdAt
      updatedAt
    }
  `;

  it('Should CRUD brands', async () => {
    const brandA = mockData.brandA;
    const { query, mutate } = await authenticatedTestClient();

    // Should return brand by ID
    const getBrandPayload = await query<any>(
      gql`
        query GetBrand($id: ID!) {
          getBrand(id: $id) {
            id
            nameString
            slug
            url
            description
            collections {
              ...TestBrandCollection
            }
            createdAt
            updatedAt
          }
        }
        ${brandCollectionFragment}
      `,
      {
        variables: {
          id: brandA.id,
        },
      },
    );
    expect(getBrandPayload.data.getBrand.id).toEqual(brandA.id);

    // Should return brand by slug
    const getBrandBySlugPayload = await query<any>(
      gql`
        query GetBrandBySlug($slug: String!) {
          getBrandBySlug(slug: $slug) {
            id
            nameString
            slug
            url
            description
            collections {
              ...TestBrandCollection
            }
            createdAt
            updatedAt
          }
        }
        ${brandCollectionFragment}
      `,
      {
        variables: {
          slug: brandA.slug,
        },
      },
    );
    expect(getBrandBySlugPayload.data.getBrandBySlug.id).toEqual(brandA.id);

    // Should return paginated brands
    const getAllBrandsPayload = await query<any>(
      gql`
        query GetAllBrands($input: BrandPaginateInput) {
          getAllBrands(input: $input) {
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
    expect(getAllBrandsPayload.data.getAllBrands.totalDocs).toEqual(mockData.allBrands.length);
    expect(getAllBrandsPayload.data.getAllBrands.totalPages).toEqual(mockData.allBrands.length);
    expect(getAllBrandsPayload.data.getAllBrands.hasPrevPage).toBeFalsy();
    expect(getAllBrandsPayload.data.getAllBrands.hasNextPage).toBeTruthy();

    // Should create brand
    const newBrandName = faker.lorem.words(2);
    const createBrandPayload = await mutate<any>(
      gql`
        mutation CreateBrand($input: CreateBrandInput!) {
          createBrand(input: $input) {
            message
            success
            brand {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            nameString: newBrandName,
          },
        },
      },
    );
    expect(createBrandPayload.data.createBrand.success).toBeTruthy();
    expect(createBrandPayload.data.createBrand.brand.nameString).toEqual(newBrandName);
  });
});
