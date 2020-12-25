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

    // Shouldn't update brand on duplicate error
    const updateBrandDuplicatePayload = await mutate<any>(
      gql`
        mutation UpdateBrand($input: UpdateBrandInput!) {
          updateBrand(input: $input) {
            message
            success
          }
        }
      `,
      {
        variables: {
          input: {
            id: createBrandPayload.data.createBrand.brand.id,
            nameString: brandA.nameString,
          },
        },
      },
    );
    expect(updateBrandDuplicatePayload.data.updateBrand.success).toBeFalsy();

    // Should update brand
    const updatedBrandName = faker.lorem.words(2);
    const updatedBrandUrl = faker.internet.url();
    const updatedBrandDescription = faker.lorem.paragraph();
    const updateBrandPayload = await mutate<any>(
      gql`
        mutation UpdateBrand($input: UpdateBrandInput!) {
          updateBrand(input: $input) {
            message
            success
            brand {
              id
              nameString
              url
              description
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createBrandPayload.data.createBrand.brand.id,
            nameString: updatedBrandName,
            url: updatedBrandUrl,
            description: updatedBrandDescription,
          },
        },
      },
    );

    expect(updateBrandPayload.data.updateBrand.success).toBeTruthy();
    expect(updateBrandPayload.data.updateBrand.brand.id).toEqual(
      updateBrandPayload.data.updateBrand.brand.id,
    );
    expect(updateBrandPayload.data.updateBrand.brand.nameString).toEqual(updatedBrandName);
    expect(updateBrandPayload.data.updateBrand.brand.url).toEqual(updatedBrandUrl);
    expect(updateBrandPayload.data.updateBrand.brand.description).toEqual(updatedBrandDescription);

    // Shouldn't add collection to the brand on duplicate error
    const existingCollectionName = getBrandPayload.data.getBrand.collections[0].nameString;
    const addCollectionToBrandDuplicatePayload = await mutate<any>(
      gql`
        mutation AddCollectionToBrand($input: AddCollectionToBrandInput!) {
          addCollectionToBrand(input: $input) {
            message
            success
            brand {
              id
              nameString
              collections {
                ...TestBrandCollection
              }
            }
          }
        }
        ${brandCollectionFragment}
      `,
      {
        variables: {
          input: {
            brandId: brandA.id,
            nameString: existingCollectionName,
          },
        },
      },
    );
    expect(addCollectionToBrandDuplicatePayload.data.addCollectionToBrand.success).toBeFalsy();

    // Should add collection to the brand
    const newCollectionName = faker.lorem.words(3);
    const newCollectionDescription = faker.lorem.paragraph();
    const addCollectionToBrandPayload = await mutate<any>(
      gql`
        mutation AddCollectionToBrand($input: AddCollectionToBrandInput!) {
          addCollectionToBrand(input: $input) {
            message
            success
            brand {
              id
              nameString
              collections {
                ...TestBrandCollection
              }
            }
          }
        }
        ${brandCollectionFragment}
      `,
      {
        variables: {
          input: {
            brandId: brandA.id,
            nameString: newCollectionName,
            description: newCollectionDescription,
          },
        },
      },
    );
    expect(addCollectionToBrandPayload.data.addCollectionToBrand.success).toBeTruthy();
    expect(addCollectionToBrandPayload.data.addCollectionToBrand.brand.collections).toHaveLength(
      brandA.collections.length + 1,
    );

    // Shouldn't delete brand used in products
    const deleteBrandUsedPayload = await mutate<any>(
      gql`
        mutation DeleteteBrand($id: ID!) {
          deleteBrand(id: $id) {
            message
            success
          }
        }
      `,
      {
        variables: {
          id: brandA.id,
        },
      },
    );
    expect(deleteBrandUsedPayload.data.deleteBrand.success).toBeFalsy();

    // Should delete brand
    const deleteBrandPayload = await mutate<any>(
      gql`
        mutation DeleteteBrand($id: ID!) {
          deleteBrand(id: $id) {
            message
            success
          }
        }
      `,
      {
        variables: {
          id: createBrandPayload.data.createBrand.brand.id,
        },
      },
    );
    expect(deleteBrandPayload.data.deleteBrand.success).toBeTruthy();
  });
});
