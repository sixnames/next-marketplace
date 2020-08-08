import {
  authenticatedTestClient,
  testClientWithContext,
} from '../../../utils/testUtils/testHelpers';
import { DEFAULT_LANG, ROLE_SLUG_ADMIN, ROLE_SLUG_GUEST } from '../../../config';
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
    const { query, mutate } = await authenticatedTestClient();

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

    // Shouldn't create role on duplicate error
    const duplicateRoleName = adminRole.nameString;
    const duplicateRoleDescription = 'newRoleDescription';
    const {
      data: { createRole: createRoleDuplicateError },
    } = await mutate(
      `
      mutation CreateRole($input: CreateRoleInput!) {
        createRole(input: $input) {
          success
          message
        }
      }
    `,
      {
        variables: {
          input: {
            name: [{ key: DEFAULT_LANG, value: duplicateRoleName }],
            description: duplicateRoleDescription,
            isStuff: false,
          },
        },
      },
    );
    expect(createRoleDuplicateError.success).toBeFalsy();

    // Should create role
    const newRoleName = 'newRoleName';
    const newRoleDescription = 'newRoleDescription';
    const {
      data: { createRole },
    } = await mutate(
      `
      mutation CreateRole($input: CreateRoleInput!) {
        createRole(input: $input) {
          success
          message
          role {
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
            name: [{ key: DEFAULT_LANG, value: newRoleName }],
            description: newRoleDescription,
            isStuff: false,
          },
        },
      },
    );
    const createdRole = createRole.role;
    expect(createRole.success).toBeTruthy();
    expect(createdRole.nameString).toEqual(newRoleName);
    expect(createdRole.description).toEqual(newRoleDescription);

    // Should create role
    const updatedRoleName = 'updatedRoleName';
    const updatedRoleDescription = 'updatedRoleDescription';
    const {
      data: { updateRole },
    } = await mutate(
      `
      mutation UpdateRole($input: UpdateRoleInput!) {
        updateRole(input: $input) {
          success
          message
          role {
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
            id: createdRole.id,
            name: [{ key: DEFAULT_LANG, value: updatedRoleName }],
            description: updatedRoleDescription,
            isStuff: false,
          },
        },
      },
    );
    expect(updateRole.success).toBeTruthy();
    expect(updateRole.role.nameString).toEqual(updatedRoleName);
    expect(updateRole.role.description).toEqual(updatedRoleDescription);
  });
});
