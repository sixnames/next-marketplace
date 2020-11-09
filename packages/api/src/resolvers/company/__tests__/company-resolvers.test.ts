import { authenticatedTestClient, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import { MOCK_COMPANIES, MOCK_NEW_COMPANY, MOCK_SAMPLE_USER } from '@yagu/mocks';
import { gql } from 'apollo-server-express';
import { UserModel } from '../../../entities/User';
import { omit } from 'lodash';

describe('Company', () => {
  it('Should CRUD companies', async () => {
    const { query } = await authenticatedTestClient();

    // Should return companies list
    const {
      data: { getAllCompanies },
    } = await query<any>(
      gql`
        query GetAllCompanies {
          getAllCompanies {
            id
            nameString
            slug
          }
        }
      `,
    );
    expect(getAllCompanies).toHaveLength(MOCK_COMPANIES.length);

    // Should return company by id
    const currentCompany = getAllCompanies[0];
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
          }
        }
      `,
      {
        variables: {
          id: currentCompany.id,
        },
      },
    );
    expect(getCompany.id).toEqual(currentCompany.id);

    // Should create company
    const sampleUser = await UserModel.findOne({ email: MOCK_SAMPLE_USER.email });
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
          ...omit(MOCK_NEW_COMPANY, 'slug'),
          logo: images,
          owner: sampleUser?.id,
          staff: [],
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
          ...omit(MOCK_NEW_COMPANY, 'slug'),
          logo: images,
          owner: sampleUser?.id,
          staff: [],
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
          ...omit(MOCK_NEW_COMPANY, 'slug'),
          nameString: 'n',
          logo: images,
          owner: sampleUser?.id,
          staff: [],
        };
      },
    });
    expect(createCompanyValidation.errors).toBeDefined();
  });
});
