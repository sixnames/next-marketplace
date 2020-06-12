import { getTestClientWithAuthenticatedUser } from '../../../utils/testUtils/testHelpers';
import { MOCK_ATTRIBUTES_GROUP } from '@rg/config';
import { attributesGroup, anotherAttributesGroup, attributeForGroup } from '../__fixtures__';

const addAttributeToGroupMutation = (
  groupId: string,
  name = attributeForGroup.name[0].value,
  variant = attributeForGroup.variant,
) => {
  return `
        mutation {
          addAttributeToGroup (
            input: {
              groupId: "${groupId}"
              name: [{key: "ru", value: "${name}"}]
              variant: ${variant}
            }
          ) {
            success
            message
            group {
              id
              nameString
              attributes {
                id
                nameString
                variant
                options {
                  id
                  nameString
                }
              }
            }
          }
        }
      `;
};

describe('Attributes Groups', () => {
  it('Should CRUD attributes groups.', async () => {
    const { query, mutate } = await getTestClientWithAuthenticatedUser();

    // Should return all attributes groups
    const {
      data: { getAllAttributesGroups },
    } = await query(`
      query {
        getAllAttributesGroups {
          id
          nameString
        }
      }
    `);
    expect(getAllAttributesGroups.length).toEqual(3);
    const group = getAllAttributesGroups[0];

    // Should return current attributes group.
    const {
      data: { getAttributesGroup },
    } = await query(`
      query {
        getAttributesGroup(id: "${group.id}") {
          id
          nameString
        }
      }
    `);
    expect(getAttributesGroup.nameString).toEqual(group.nameString);

    // Shouldn't create attributes group on validation error.
    const {
      data: {
        createAttributesGroup: { success: createAttributesGroupSuccess },
      },
    } = await mutate(
      `
        mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
          createAttributesGroup(input: $input) {
            success
            group {
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: [{ key: 'ru', value: 'f' }],
          },
        },
      },
    );
    expect(createAttributesGroupSuccess).toBeFalsy();

    // Shouldn't create attributes group on duplicate error.
    const {
      data: {
        createAttributesGroup: { success: createDuplicateAttributesGroupSuccess },
      },
    } = await mutate(
      `
        mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
          createAttributesGroup(input: $input) {
            success
            message
            group {
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: MOCK_ATTRIBUTES_GROUP.name,
          },
        },
      },
    );
    expect(createDuplicateAttributesGroupSuccess).toBeFalsy();

    // Should create attributes group.
    const {
      data: { createAttributesGroup },
    } = await mutate(
      `
        mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
          createAttributesGroup(input: $input) {
            success
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: attributesGroup.name,
          },
        },
      },
    );
    expect(createAttributesGroup.success).toBeTruthy();
    expect(createAttributesGroup.group.nameString).toEqual(attributesGroup.name[0].value);

    // Should update attributes group.
    const {
      data: { updateAttributesGroup },
    } = await mutate(
      `
        mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
          updateAttributesGroup(input: $input) {
            success
            group {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createAttributesGroup.group.id,
            name: anotherAttributesGroup.name,
          },
        },
      },
    );
    expect(updateAttributesGroup.success).toBeTruthy();
    expect(updateAttributesGroup.group.id).toEqual(createAttributesGroup.group.id);
    expect(updateAttributesGroup.group.nameString).toEqual(anotherAttributesGroup.name[0].value);

    // Shouldn't create attribute and return validation error.
    const {
      data: {
        addAttributeToGroup: { success: addAttributeToGroupFailSuccess },
      },
    } = await mutate(addAttributeToGroupMutation(group.id, 'f'));
    expect(addAttributeToGroupFailSuccess).toBeFalsy();

    // Should create attribute and add it to the group.
    const {
      data: {
        addAttributeToGroup: {
          group: { attributes },
          success,
        },
      },
    } = await mutate(addAttributeToGroupMutation(group.id));
    const addedAttribute = attributes[0];
    expect(success).toBeTruthy();
    expect(attributes.length).toEqual(1);
    expect(addedAttribute.nameString).toEqual(attributeForGroup.name[0].value);
    expect(addedAttribute.variant).toEqual(attributeForGroup.variant);

    // Should update attribute in the group.
    const newName = 'cy-test-attributes-group-name-new';
    const {
      data: {
        updateAttributeInGroup: { group: updatedGroup },
        updateAttributeInGroup,
      },
    } = await mutate(
      `
        mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
          updateAttributeInGroup (
            input: $input
          ) {
            success
            message
            group {
              id
              attributes {
                id
                nameString
              }
            }
          }
        }
      `,
      {
        variables: {
          input: {
            groupId: group.id,
            attributeId: addedAttribute.id,
            name: [{ key: 'ru', value: newName }],
            variant: addedAttribute.variant,
          },
        },
      },
    );
    const updatedAttribute = updatedGroup.attributes.find(
      ({ id }: { id: string }) => id === addedAttribute.id,
    );
    expect(updateAttributeInGroup.success).toBeTruthy();
    expect(updatedAttribute.nameString).toEqual(newName);

    // Should delete attribute from the group.
    const {
      data: {
        deleteAttributeFromGroup: {
          group: groupAfterAttributeDelete,
          success: successAfterAttributeDelete,
        },
      },
    } = await mutate(`
        mutation {
          deleteAttributeFromGroup (
            input: {
              groupId: "${group.id}"
              attributeId: "${updatedAttribute.id}"
            }
          ) {
            success
            group {
              id
              attributes {
                id
                nameString
              }
            }
          }
        }
      `);
    expect(successAfterAttributeDelete).toBeTruthy();
    expect(groupAfterAttributeDelete.attributes.length).toEqual(0);

    // Should delete attributes group.
    const {
      data: { deleteAttributesGroup },
    } = await mutate(`
        mutation {
          deleteAttributesGroup (
            id: "${group.id}"
          ) {
            success
          }
        }
      `);
    expect(deleteAttributesGroup.success).toBeTruthy();
  });
});
