import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
// import * as faker from 'faker';

describe('Manufacturer', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD manufacturers', async () => {
    const manufacturerA = mockData.manufacturerA;
    const { query } = await authenticatedTestClient();

    // Should return manufacturer by ID
    const getManufacturerPayload = await query<any>(
      gql`
        query GetManufacturer($id: ID!) {
          getManufacturer(id: $id) {
            id
            url
            slug
            itemId
            nameString
            description
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          id: manufacturerA.id,
        },
      },
    );
    expect(getManufacturerPayload.data.getManufacturer.id).toEqual(manufacturerA.id);

    // Should return manufacturer by Slug
    const getManufacturerBySlugPayload = await query<any>(
      gql`
        query GetManufacturerBySlug($slug: String!) {
          getManufacturerBySlug(slug: $slug) {
            id
            url
            slug
            itemId
            nameString
            description
            createdAt
            updatedAt
          }
        }
      `,
      {
        variables: {
          slug: manufacturerA.slug,
        },
      },
    );
    expect(getManufacturerBySlugPayload.data.getManufacturerBySlug.id).toEqual(manufacturerA.id);

    // Should return paginated manufacturers
    const getAllBrandsPayload = await query<any>(
      gql`
        query GetAllManufacturers($input: ManufacturerPaginateInput) {
          getAllManufacturers(input: $input) {
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
    expect(getAllBrandsPayload.data.getAllManufacturers.totalDocs).toEqual(
      mockData.allManufacturers.length,
    );
    expect(getAllBrandsPayload.data.getAllManufacturers.totalPages).toEqual(
      mockData.allManufacturers.length,
    );
    expect(getAllBrandsPayload.data.getAllManufacturers.hasPrevPage).toBeFalsy();
    expect(getAllBrandsPayload.data.getAllManufacturers.hasNextPage).toBeTruthy();
  });
});
