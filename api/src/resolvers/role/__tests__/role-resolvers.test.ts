import {
  authenticatedTestClient,
  testClientWithContext,
} from '../../../utils/testUtils/testHelpers';
import {
  cmsRoute,
  DEFAULT_LANG,
  OPERATION_TYPE_READ,
  ROLE_SLUG_ADMIN,
  ROLE_SLUG_GUEST,
} from '../../../config';
import { Role, RoleModel } from '../../../entities/Role';
import { RoleRule, RoleRuleOperation } from '../../../entities/RoleRule';
import { NavItemModel } from '../../../entities/NavItem';

describe('Roles', () => {
  it('Should return guest session role', async () => {
    const { query } = await testClientWithContext();
    const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });
    if (!guestRole) {
      throw new Error('Guest role not found');
    }

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

    // Shouldn't update role on validation error
    const {
      data: { createRole: createRoleValidationError },
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
            name: [{ key: DEFAULT_LANG, value: 'f' }],
            description: 'b',
            isStuff: false,
          },
        },
      },
    );
    expect(createRoleValidationError.success).toBeFalsy();

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

    // Shouldn't update role main info on validation error
    const {
      data: { updateRole: updateRoleValidationError },
    } = await mutate(
      `
      mutation UpdateRole($input: UpdateRoleInput!) {
        updateRole(input: $input) {
          success
          message
        }
      }
    `,
      {
        variables: {
          input: {
            id: createdRole.id,
            name: [{ key: DEFAULT_LANG, value: 'f' }],
            description: 'b',
            isStuff: false,
          },
        },
      },
    );
    expect(updateRoleValidationError.success).toBeFalsy();

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
              id
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

    // Should update role operation customFilter
    const operationCustomFilter = '{"_id": "__authenticatedUser"}';
    const {
      data: { setRoleOperationCustomFilter },
    } = await mutate(
      `
      mutation SetRoleOperationCustomFilter($input: SetRoleOperationCustomFilterInput!) {
        setRoleOperationCustomFilter(input: $input) {
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
            customFilter: operationCustomFilter,
          },
        },
      },
    );

    const updatedCustomFilterOperation = setRoleOperationCustomFilter.role.rules
      .find(({ entity }: RoleRule) => entity === userEntity)
      .operations.find(
        ({ operationType }: RoleRuleOperation) => operationType === OPERATION_TYPE_READ,
      );
    expect(updatedCustomFilterOperation.customFilter).toEqual(operationCustomFilter);
    expect(setRoleOperationPermission.success).toBeTruthy();

    // Should set role rule restricted fields
    const restrictedField = 'email';
    const {
      data: { setRoleRuleRestrictedField },
    } = await mutate(
      `
      mutation SetRoleRuleRestrictedField($input: SetRoleRuleRestrictedFieldInput!) {
        setRoleRuleRestrictedField(input: $input) {
          success
          message
          role {
            id
            rules {
              id
              restrictedFields
            }
          }
        }
      }
    `,
      {
        variables: {
          input: {
            roleId: createdRole.id,
            ruleId: updatedRule.id,
            restrictedField,
          },
        },
      },
    );
    const ruleWithRestrictedField = setRoleRuleRestrictedField.role.rules.find(
      ({ id }: RoleRule) => id === updatedRule.id,
    );
    expect(setRoleRuleRestrictedField.success).toBeTruthy();
    expect(ruleWithRestrictedField.restrictedFields).toContain(restrictedField);

    // Should unset role rule restricted fields
    const {
      data: { setRoleRuleRestrictedField: unsetRoleRuleRestrictedField },
    } = await mutate(
      `
      mutation SetRoleRuleRestrictedField($input: SetRoleRuleRestrictedFieldInput!) {
        setRoleRuleRestrictedField(input: $input) {
          success
          message
          role {
            id
            rules {
              id
              restrictedFields
            }
          }
        }
      }
    `,
      {
        variables: {
          input: {
            roleId: createdRole.id,
            ruleId: updatedRule.id,
            restrictedField,
          },
        },
      },
    );
    const ruleWithoutRestrictedField = unsetRoleRuleRestrictedField.role.rules.find(
      ({ id }: RoleRule) => id === updatedRule.id,
    );
    expect(unsetRoleRuleRestrictedField.success).toBeTruthy();
    expect(ruleWithoutRestrictedField.restrictedFields).not.toContain(restrictedField);

    // Should set role rule allowed nav item
    const navItem = await NavItemModel.findOne({ slug: cmsRoute.slug });
    if (!navItem) {
      throw Error('Nav item not found');
    }
    const {
      data: { setRoleAllowedNavItem },
    } = await mutate(
      `
      mutation SetRoleAllowedNavItem($input: SetRoleAllowedNavItemInput!) {
        setRoleAllowedNavItem(input: $input) {
          success
          message
          role {
            id
            allowedAppNavigation
          }
        }
      }
    `,
      {
        variables: {
          input: {
            roleId: createdRole.id,
            navItemId: navItem.id,
          },
        },
      },
    );
    expect(setRoleAllowedNavItem.success).toBeTruthy();
    expect(setRoleAllowedNavItem.role.allowedAppNavigation).toContain(navItem.id);

    // Should unset role rule allowed nav item
    const {
      data: { setRoleAllowedNavItem: unsetRoleAllowedNavItem },
    } = await mutate(
      `
      mutation SetRoleAllowedNavItem($input: SetRoleAllowedNavItemInput!) {
        setRoleAllowedNavItem(input: $input) {
          success
          message
          role {
            id
            allowedAppNavigation
          }
        }
      }
    `,
      {
        variables: {
          input: {
            roleId: createdRole.id,
            navItemId: navItem.id,
          },
        },
      },
    );

    expect(unsetRoleAllowedNavItem.success).toBeTruthy();
    expect(unsetRoleAllowedNavItem.role.allowedAppNavigation).not.toContain(navItem.id);

    // Should delete role
    const {
      data: { deleteRole },
    } = await mutate(
      `
      mutation DeleteRole($id: ID!) {
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
