import {
  authenticatedTestClient,
  testClientWithContext,
} from '../../../utils/testUtils/testHelpers';
import {
  DEFAULT_LANG,
  OPERATION_TYPE_READ,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_GUEST,
} from '../../../config';
import { Role, RoleModel } from '../../../entities/Role';
import { RoleRule, RoleRuleOperation } from '../../../entities/RoleRule';

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
              allow
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
              allow
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
              allow
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
            id
            nameString
            entity
            restrictedFields
            operations {
              id
              operationType
              allow
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
            rules {
              id
              nameString
              entity
              restrictedFields
              operations {
                id
                operationType
                allow
                customFilter
              }
            }
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

    // Should update role main info
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

    // Should update role operation permission
    const userEntity = 'User';
    const updateTargetRule = createdRole.rules.find(
      ({ entity }: RoleRule) => entity === userEntity,
    );
    const updateTargetOperation = updateTargetRule.operations.find(
      ({ operationType }: RoleRuleOperation) => operationType === OPERATION_TYPE_READ,
    );
    const {
      data: { setRoleOperationPermission },
    } = await mutate(
      `
      mutation SetRoleOperationPermission($input: SetRoleOperationPermissionInput!) {
        setRoleOperationPermission(input: $input) {
          success
          message
          role {
            id
            nameString
            description
            rules {
              nameString
              entity
              restrictedFields
              operations {
                operationType
                allow
                customFilter
              }
            }
          }
        }
      }
    `,
      {
        variables: {
          input: {
            roleId: createdRole.id,
            operationId: updateTargetOperation.id,
            allow: true,
          },
        },
      },
    );

    const { rules } = setRoleOperationPermission.role;
    const updatedRule = rules.find(({ entity }: RoleRule) => entity === userEntity);
    const updatedOperation = updatedRule.operations.find(
      ({ operationType }: RoleRuleOperation) => operationType === OPERATION_TYPE_READ,
    );
    expect(updatedOperation.allow).toBeTruthy();
    expect(setRoleOperationPermission.success).toBeTruthy();

    // Should delete role
    const {
      data: { deleteRole },
    } = await mutate(
      `
      mutation UpdateRole($id: ID!) {
        deleteRole(id: $id) {
          success
          message
        }
      }
    `,
      {
        variables: {
          id: createdRole.id,
        },
      },
    );
    expect(deleteRole.success).toBeTruthy();
  });
});
