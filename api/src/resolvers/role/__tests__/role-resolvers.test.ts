import {
  authenticatedTestClient,
  testClientWithContext,
} from '../../../utils/testUtils/testHelpers';
import { ROLE_SLUG_ADMIN, ROLE_SLUG_GUEST } from '../../../config';
import { Role, RoleModel } from '../../../entities/Role';

describe('Roles', () => {
  it('Should return session role', async () => {
    const { query } = await testClientWithContext();
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw new Error('Guest role not found');
    }

    // Should return guest session role
    const {
      data: { getSessionRole },
    } = await query(
      `
      query GetSessionRole {
        getSessionRole {
          id
          nameString
          description
          slug
          isStuff
          appNavigation {
            id
            nameString
            path
            icon
            children {
              id
              nameString
              path
              icon
            }
          }
          rules {
            nameString
            entity
            restrictedFields
            operations {
              operationType
              allowed
              customFilter
            }
          }
        }
      }
    `,
    );
    expect(getSessionRole.id).toEqual(guestRole.id);
  });

  it('Should CRUD role.', async () => {
    const { query } = await authenticatedTestClient();

    // Should return all roles list
    const {
      data: { getAllRoles },
    } = await query(`
      query GetAllRoles {
        getAllRoles {
          id
          nameString
          description
          slug
          isStuff
          rules {
            nameString
            entity
            restrictedFields
            operations {
              operationType
              allowed
              customFilter
            }
          }
        }
      }
    `);
    const adminRole = getAllRoles.find(({ slug }: Role) => slug === ROLE_SLUG_ADMIN);
    expect(getAllRoles).toHaveLength(2);

    // Should return current role
    const {
      data: { getRole },
    } = await query(
      `
      query GetRole($id: ID!) {
        getRole(id: $id) {
          id
          nameString
          description
          slug
          isStuff
          rules {
            nameString
            entity
            restrictedFields
            operations {
              operationType
              allowed
              customFilter
            }
          }
        }
      }
    `,
      {
        variables: {
          id: adminRole.id,
        },
      },
    );
    expect(getRole.id).toEqual(adminRole.id);

    // Should return admin session role
    const {
      data: { getSessionRole },
    } = await query(
      `
      query GetSessionRole {
        getSessionRole {
          id
          nameString
          description
          slug
          isStuff
          appNavigation {
            id
            nameString
            path
            icon
            children {
              id
              nameString
              path
              icon
            }
          }
          rules {
            nameString
            entity
            restrictedFields
            operations {
              operationType
              allowed
              customFilter
            }
          }
        }
      }
    `,
    );
    expect(getSessionRole.id).toEqual(adminRole.id);
  });
});
