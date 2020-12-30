import { authenticatedTestClient, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { DEFAULT_CITY, MOCK_ADDRESS_A } from '@yagu/shared';
import { fakerEn, getFakePhone } from '../../../utils/testUtils/fakerLocales';

describe('Company', () => {
  let mockData: CreateTestDataPayloadInterface;

  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD companies', async () => {
    const { query, mutate } = await authenticatedTestClient();

    // Should return companies list
    const {
      data: { getAllCompanies },
    } = await query<any>(
      gql`
        query GetAllCompanies {
          getAllCompanies {
            docs {
              id
              nameString
              slug
            }
          }
        }
      `,
    );
    expect(getAllCompanies.docs).toHaveLength(mockData.mockCompanies.length);

    // Should return company by id
    const {
      data: { getCompany },
    } = await query<any>(
      gql`
        query GetCompany($id: ID!) {
          getCompany(id: $id) {
            id
            nameString
            slug
            owner {
              id
              shortName
            }
            staff {
              id
              shortName
            }
            logo {
              index
              url
            }
            contacts {
              emails
              phones
            }
            shops {
              docs {
                id
                slug
                nameString
                address {
                  formattedAddress
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          id: mockData.companyA.id,
        },
      },
    );
    expect(getCompany.id).toEqual(mockData.companyA.id);

    // Should create company
    const newCompanyName = 'newCompanyName';
    const createCompanyPayload = await mutateWithImages({
      mutation: gql`
        mutation CreateCompany($input: CreateCompanyInput!) {
          createCompany(input: $input) {
            success
            message
            company {
              id
              nameString
              slug
              owner {
                id
                shortName
              }
              staff {
                id
                shortName
              }
              logo {
                index
                url
              }
              contacts {
                emails
                phones
              }
            }
          }
        }
      `,
      input: (images) => {
        return {
          nameString: newCompanyName,
          logo: images,
          owner: mockData.sampleUser.id,
          staff: [],
          contacts: {
            emails: [fakerEn.internet.email(), fakerEn.internet.email()],
            phones: [getFakePhone(), getFakePhone()],
          },
        };
      },
    });
    const {
      data: { createCompany },
    } = createCompanyPayload;
    expect(createCompany.success).toBeTruthy();

    // Shouldn't create company on duplicate error
    const createCompanyDuplicate = await mutateWithImages({
      mutation: gql`
        mutation CreateCompany($input: CreateCompanyInput!) {
          createCompany(input: $input) {
            success
            message
          }
        }
      `,
      input: (images) => {
        return {
          nameString: newCompanyName,
          logo: images,
          owner: mockData.sampleUser.id,
          staff: [],
          contacts: {
            emails: [fakerEn.internet.email(), fakerEn.internet.email()],
            phones: [getFakePhone(), getFakePhone()],
          },
        };
      },
    });
    expect(createCompanyDuplicate.data.success).toBeFalsy();

    // Shouldn't create company on validation error
    const createCompanyValidation = await mutateWithImages({
      mutation: gql`
        mutation CreateCompany($input: CreateCompanyInput!) {
          createCompany(input: $input) {
            success
            message
          }
        }
      `,
      input: (images) => {
        return {
          contacts: {
            emails: [fakerEn.internet.email(), fakerEn.internet.email()],
            phones: [getFakePhone(), getFakePhone()],
          },
          nameString: 'n',
          logo: images,
          owner: mockData.sampleUser.id,
          staff: [],
        };
      },
    });
    expect(createCompanyValidation.errors).toBeDefined();

    // Should update company
    const companyNewName = 'companyNewName';
    const updateCompanyPayload = await mutateWithImages({
      mutation: gql`
        mutation UpdateCompany($input: UpdateCompanyInput!) {
          updateCompany(input: $input) {
            success
            message
            company {
              id
              nameString
              slug
            }
          }
        }
      `,
      input: (images) => {
        return {
          contacts: {
            emails: [fakerEn.internet.email(), fakerEn.internet.email()],
            phones: [getFakePhone(), getFakePhone()],
          },
          nameString: companyNewName,
          logo: images,
          owner: mockData.sampleUser.id,
          staff: [],
          id: createCompany.company.id,
        };
      },
    });
    const {
      data: { updateCompany },
    } = updateCompanyPayload;
    const { company: updatedCompany } = updateCompany;
    expect(updateCompany.success).toBeTruthy();
    expect(updatedCompany.id).toEqual(createCompany.company.id);
    expect(updatedCompany.nameString).toEqual(companyNewName);

    // Should add shop to company
    const addShopToCompanyPayload = await mutateWithImages({
      mutation: gql`
        mutation AddShopToCompany($input: AddShopToCompanyInput!) {
          addShopToCompany(input: $input) {
            success
            message
            company {
              shops {
                docs {
                  id
                  nameString
                }
              }
            }
          }
        }
      `,
      input: (images) => {
        const [logo, ...assets] = images;
        return {
          companyId: updatedCompany.id,
          city: DEFAULT_CITY,
          nameString: fakerEn.commerce.productName(),
          contacts: {
            emails: [fakerEn.internet.email(), fakerEn.internet.email()],
            phones: [getFakePhone(), getFakePhone()],
          },
          address: {
            formattedAddress: MOCK_ADDRESS_A.formattedAddress,
            point: MOCK_ADDRESS_A.point,
          },
          logo: [logo],
          assets,
        };
      },
      fileNames: ['test-company-logo.png', 'test-shop-asset-0.png'],
    });

    const {
      data: { addShopToCompany },
    } = addShopToCompanyPayload;
    const {
      company: { shops },
    } = addShopToCompany;
    const createdShop = shops.docs[0];
    expect(shops.docs).toHaveLength(1);
    expect(addShopToCompany.success).toBeTruthy();

    // Should update shop in company
    const shopNewName = 'shopNewName';
    const updateShopInCompanyPayload = await mutateWithImages({
      mutation: gql`
        mutation UpdateShopInCompany($input: UpdateShopInCompanyInput!) {
          updateShopInCompany(input: $input) {
            success
            message
            company {
              shops {
                docs {
                  id
                  nameString
                  assets {
                    index
                    url
                  }
                }
              }
            }
          }
        }
      `,
      input: (images) => {
        const [logo, ...assets] = images;
        return {
          companyId: updatedCompany.id,
          shopId: createdShop.id,
          nameString: shopNewName,
          city: DEFAULT_CITY,
          contacts: {
            emails: [fakerEn.internet.email(), fakerEn.internet.email()],
            phones: [getFakePhone(), getFakePhone()],
          },
          address: {
            formattedAddress: MOCK_ADDRESS_A.formattedAddress,
            point: MOCK_ADDRESS_A.point,
          },
          logo: [logo],
          assets,
        };
      },
      fileNames: ['test-image-0.png', 'test-image-1.png', 'test-image-2.png'],
    });
    const {
      data: { updateShopInCompany },
    } = updateShopInCompanyPayload;
    const updatedShop = updateShopInCompany.company.shops.docs[0];
    expect(updatedShop.nameString).toEqual(shopNewName);
    expect(updatedShop.assets).toHaveLength(2);
    expect(updateShopInCompany.success).toBeTruthy();

    // Should delete shop from company
    const deleteShopFromCompanyPayload = await mutate<any>(
      gql`
        mutation DeleteShopFromCompany($input: DeleteShopFromCompanyInput!) {
          deleteShopFromCompany(input: $input) {
            success
            message
            company {
              shops {
                docs {
                  id
                  nameString
                  assets {
                    index
                    url
                  }
                }
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            companyId: updatedCompany.id,
            shopId: createdShop.id,
          },
        },
      },
    );
    const {
      data: { deleteShopFromCompany },
    } = deleteShopFromCompanyPayload;
    expect(deleteShopFromCompany.company.shops.docs).toHaveLength(0);
    expect(deleteShopFromCompany.success).toBeTruthy();

    // Should delete company
    const deleteCompanyPayload = await mutate<any>(
      gql`
        mutation DeleteCompany($id: ID!) {
          deleteCompany(id: $id) {
            success
            message
          }
        }
      `,
      {
        variables: {
          id: updatedCompany.id,
        },
      },
    );
    const {
      data: { deleteCompany },
    } = deleteCompanyPayload;
    expect(deleteCompany.success).toBeTruthy();
  });
});
