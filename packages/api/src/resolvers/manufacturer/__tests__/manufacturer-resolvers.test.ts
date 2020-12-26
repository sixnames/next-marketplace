import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import faker from 'faker';
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
    const { query, mutate } = await authenticatedTestClient();

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
    const getAllManufacturersPayload = await query<any>(
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
    expect(getAllManufacturersPayload.data.getAllManufacturers.totalDocs).toEqual(
      mockData.allManufacturers.length,
    );
    expect(getAllManufacturersPayload.data.getAllManufacturers.totalPages).toEqual(
      mockData.allManufacturers.length,
    );
    expect(getAllManufacturersPayload.data.getAllManufacturers.hasPrevPage).toBeFalsy();
    expect(getAllManufacturersPayload.data.getAllManufacturers.hasNextPage).toBeTruthy();

    // Should create manufacturer
    const newManufacturerName = faker.lorem.words(2);
    const createManufacturerPayload = await mutate<any>(
      gql`
        mutation CreateManufacturer($input: CreateManufacturerInput!) {
          createManufacturer(input: $input) {
            message
            success
            manufacturer {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            nameString: newManufacturerName,
          },
        },
      },
    );
    expect(createManufacturerPayload.data.createManufacturer.success).toBeTruthy();
    expect(createManufacturerPayload.data.createManufacturer.manufacturer.nameString).toEqual(
      newManufacturerName,
    );

    // Shouldn't update manufacturer on duplicate error
    const updateManufacturerDuplicatePayload = await mutate<any>(
      gql`
        mutation UpdateManufacturer($input: UpdateManufacturerInput!) {
          updateManufacturer(input: $input) {
            message
            success
          }
        }
      `,
      {
        variables: {
          input: {
            id: createManufacturerPayload.data.createManufacturer.manufacturer.id,
            nameString: manufacturerA.nameString,
          },
        },
      },
    );
    expect(updateManufacturerDuplicatePayload.data.updateManufacturer.success).toBeFalsy();

    // Should update manufacturer
    const updatedManufacturerName = faker.lorem.words(2);
    const updatedManufacturerUrl = faker.internet.url();
    const updatedManufacturerDescription = faker.lorem.paragraph();
    const updateManufacturerPayload = await mutate<any>(
      gql`
        mutation UpdateManufacturer($input: UpdateManufacturerInput!) {
          updateManufacturer(input: $input) {
            message
            success
            manufacturer {
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
            id: createManufacturerPayload.data.createManufacturer.Manufacturer.id,
            nameString: updatedManufacturerName,
            url: updatedManufacturerUrl,
            description: updatedManufacturerDescription,
          },
        },
      },
    );

    expect(updateManufacturerPayload.data.updateManufacturer.success).toBeTruthy();
    expect(updateManufacturerPayload.data.updateManufacturer.manufacturer.id).toEqual(
      createManufacturerPayload.data.updateManufacturer.manufacturer.id,
    );
    expect(updateManufacturerPayload.data.updateManufacturer.manufacturer.nameString).toEqual(
      updatedManufacturerName,
    );
    expect(updateManufacturerPayload.data.updateManufacturer.manufacturer.url).toEqual(
      updatedManufacturerUrl,
    );
    expect(updateManufacturerPayload.data.updateManufacturer.manufacturer.description).toEqual(
      updatedManufacturerDescription,
    );

    // Shouldn't delete manufacturer used in products
    const deleteManufacturerUsedPayload = await mutate<any>(
      gql`
        mutation DeleteteManufacturer($id: ID!) {
          deleteManufacturer(id: $id) {
            message
            success
          }
        }
      `,
      {
        variables: {
          id: manufacturerA.id,
        },
      },
    );
    expect(deleteManufacturerUsedPayload.data.deleteManufacturer.success).toBeFalsy();

    // Should delete manufacturer
    const deleteManufacturerPayload = await mutate<any>(
      gql`
        mutation DeleteteManufacturer($id: ID!) {
          deleteManufacturer(id: $id) {
            message
            success
          }
        }
      `,
      {
        variables: {
          id: createManufacturerPayload.data.createManufacturer.manufacturer.id,
        },
      },
    );
    expect(deleteManufacturerPayload.data.deleteManufacturer.success).toBeTruthy();
  });
});
