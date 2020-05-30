import { getTestClientWithAuthenticatedUser } from '../../../utils/test-data/testHelpers';
import { anotherAttributesGroup, attributeForGroup, attributesGroup } from '../__fixtures__';

const addAttributeToGroupMutation = (
  groupId: string,
  name = attributeForGroup.name,
  type = attributeForGroup.type,
) => `
        mutation {
          addAttributeToGroup (
            input: {
              groupId: "${groupId}"
              name: "${name}"
              type: ${type}
            }
          ) {
            success
            message
            group {
              id
              name
              attributes {
                id
                name
                type
                options {
                  id
                  name
                }
              }
            }
          }
        }
      `;

describe('Attributes Groups', () => {
  it('Should CRUD attributes groups.', async () => {
    const { mutate, query } = await getTestClientWithAuthenticatedUser();

    // Should return all attributes groups
    const { data } = await query(`
      query {
        getAllAttributesGroups {
          id
          name
        }
      }
    `);
    expect(data.getAllAttributesGroups.length).toEqual(3);

    const group = data.getAllAttributesGroups[0];

    // Should return current attributes group.
    const {
      data: { getAttributesGroup },
    } = await query(`
      query {
        getAttributesGroup(id: "${group.id}") {
          id
          name
        }
      }
    `);
    expect(getAttributesGroup.name).toEqual(group.name);

    // Shouldn't create attributes group on validation error.
    const {
      data: {
        createAttributesGroup: { success: createAttributesGroupSuccess },
      },
    } = await mutate(`
        mutation {
          createAttributesGroup (
            input: {
              name: "f"
            }
          ) {
            success
            group {
              name
            }
          }
        }
      `);
    expect(createAttributesGroupSuccess).toBeFalsy();

    // Should create attributes group.
    const {
      data: { createAttributesGroup },
    } = await mutate(`
        mutation {
          createAttributesGroup (
            input: {
              name: "${attributesGroup.name}"
            }
          ) {
            success
            group {
              id
              name
            }
          }
        }
      `);
    expect(createAttributesGroup.success).toBeTruthy();
    expect(createAttributesGroup.group.name).toEqual(attributesGroup.name);

    // Should update attributes group.
    const {
      data: { updateAttributesGroup },
    } = await mutate(`
        mutation {
          updateAttributesGroup (
            input: {
              id: "${createAttributesGroup.group.id}"
              name: "${anotherAttributesGroup.name}"
            }
          ) {
            success
            group {
              id
              name
            }
          }
        }
      `);
    expect(updateAttributesGroup.success).toBeTruthy();
    expect(updateAttributesGroup.group.id).toEqual(createAttributesGroup.group.id);
    expect(updateAttributesGroup.group.name).toEqual(anotherAttributesGroup.name);

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
    expect(addedAttribute.name).toEqual(attributeForGroup.name);
    expect(addedAttribute.type).toEqual(attributeForGroup.type);

    // Should update attribute in the group.
    const newName = 'cy-test-attributes-group-name-new';
    const {
      data: {
        updateAttributeInGroup: { group: updatedGroup },
        updateAttributeInGroup,
      },
    } = await mutate(`
        mutation {
          updateAttributeInGroup (
            input: {
              groupId: "${group.id}"
              attributeId: "${addedAttribute.id}"
              name: "${newName}"
              type: ${addedAttribute.type}
            }
          ) {
            success
            message
            group {
              id
              attributes {
                id
                name
              }
            }
          }
        }
      `);
    const updatedAttribute = updatedGroup.attributes.find(
      ({ id }: { id: string }) => id === addedAttribute.id,
    );
    expect(updateAttributeInGroup.success).toBeTruthy();
    expect(updatedAttribute.name).toEqual(newName);

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
                name
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
