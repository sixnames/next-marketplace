import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { ROLE_SLUG_ADMIN } from '../../../config';
import { Role } from '../../../entities/Role';

describe('Roles', () => {
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
            id
            nameString
            entity
            restrictedFields
            operations {
              id
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
            id
            nameString
            entity
            restrictedFields
            operations {
              id
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
  });
});
