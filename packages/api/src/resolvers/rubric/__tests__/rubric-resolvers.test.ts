import { anotherRubric, testRubric } from '../__fixtures__';
import { getTestClientWithAuthenticatedUser } from '../../../utils/test-data/testHelpers';
import { MOCK_RUBRIC_LEVEL_ONE, MOCK_RUBRIC_LEVEL_TWO } from '@rg/config';
import getLangField from '../../../utils/getLangField';
import { DEFAULT_LANG } from '../../../config';

describe.only('Rubrics', () => {
  it('Should rubrics CRUD', async () => {
    expect(true).toBeTruthy();
    const { query } = await getTestClientWithAuthenticatedUser();

    // Should return rubrics tree=
    const {
      data: {
        getRubricsTree,
        getAllRubricVariants,
        // getAllAttributesGroups
      },
    } = await query(`
      query {
        getAllRubricVariants {
          id
          name
        }
        getAllAttributesGroups {
          id
          name
        }
        getRubricsTree {
          id
          name
          children {
            id
            name
          }
        }
      }
    `);

    // const attributesGroup = getAllAttributesGroups[0];
    const treeParent = getRubricsTree[0];
    const treeChild = treeParent.children[0];
    expect(getRubricsTree.length).toEqual(1);
    expect(treeParent.name).toEqual(getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG));
    expect(treeParent.children.length).toEqual(2);
    expect(treeChild.name).toEqual(getLangField(MOCK_RUBRIC_LEVEL_TWO.name, DEFAULT_LANG));

    // Should return current rubric
    const { data } = await query(`
      query {
        getRubric(id: "${treeParent.id}") {
          id
          name
          catalogueName
        }
      }
    `);
    expect(data.getRubric.id).toEqual(treeParent.id);
    expect(data.getRubric.name).toEqual(getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG));
    expect(data.getRubric.catalogueName).toEqual(
      getLangField(MOCK_RUBRIC_LEVEL_ONE.catalogueName, DEFAULT_LANG),
    );

    // Should return duplicate rubric error on rubric create
    const { mutate } = await getTestClientWithAuthenticatedUser();
    const { data: exists } = await mutate(`
      mutation {
        createRubric(
          input: {
            name: [{key: "ru", value: "${getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG)}"}]
            catalogueName: [{key: "ru", value: "${getLangField(
              MOCK_RUBRIC_LEVEL_ONE.catalogueName,
              DEFAULT_LANG,
            )}"}]
            variant: "${getAllRubricVariants[0].id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
          }
        }
      }
    `);
    expect(exists.createRubric.success).toBeFalsy();

    // Should create rubric
    const {
      data: { createRubric },
    } = await mutate(`
      mutation {
        createRubric(
          input: {
            name: [{key: "ru", value: "${testRubric.name}"}]
            catalogueName: [{key: "ru", value: "${testRubric.catalogueName}"}]
            variant: "${getAllRubricVariants[0].id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            catalogueName
            variant {
              id
              name
            }
          }
        }
      }
    `);
    expect(createRubric.success).toBeTruthy();
    expect(createRubric.rubric.name).toEqual(testRubric.name);
    expect(createRubric.rubric.catalogueName).toEqual(testRubric.catalogueName);

    // Should return duplicate rubric error on rubric update
    const {
      data: { updateRubric: falseUpdateRubric },
    } = await mutate(`
      mutation {
        updateRubric(
          input: {
            id: "${createRubric.rubric.id}"
            name: [{key: "ru", value: "${getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG)}"}]
            catalogueName: [{key: "ru", value: "${getLangField(
              MOCK_RUBRIC_LEVEL_ONE.catalogueName,
              DEFAULT_LANG,
            )}"}]
            variant: "${createRubric.rubric.variant.id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            catalogueName
          }
        }
      }
    `);
    expect(falseUpdateRubric.success).toBeFalsy();

    // Should update rubric
    const {
      data: { updateRubric },
    } = await mutate(`
      mutation {
        updateRubric(
          input: {
            id: "${createRubric.rubric.id}"
            name: [{key: "ru", value: "${anotherRubric.name}"}]
            catalogueName: [{key: "ru", value: "${anotherRubric.catalogueName}"}]
            variant: "${createRubric.rubric.variant.id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            catalogueName
          }
        }
      }
    `);

    expect(updateRubric.success).toBeTruthy();
    expect(updateRubric.rubric.name).toEqual(anotherRubric.name);
    expect(updateRubric.rubric.catalogueName).toEqual(anotherRubric.catalogueName);

    // Should delete rubric
    /*const {
      data: { deleteRubric },
    } = await mutate(`
      mutation {
        deleteRubric(
          id: "${updateRubric.rubric.id}"
        ) {
          success
        }
      }
    `);
    expect(deleteRubric.success).toBeTruthy();*/

    // Should add attributes group to the second level rubric
    /*const {
      data: {
        addAttributesGroupToRubric: { rubric, success },
      },
    } = await mutate(`
      mutation {
        addAttributesGroupToRubric(
          input: {
            rubricId: "${treeChild.id}"
            attributesGroupId: "${attributesGroup.id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            level
            attributesGroups {
              node {
                id
                name
              }
            }
          }
        }
      }
    `);
    const { attributesGroups } = rubric;
    expect(success).toBeTruthy();
    expect(attributesGroups.length).toEqual(2);*/

    // Should delete attributes group from rubric
    /*const {
      data: { deleteAttributesGroupFromRubric },
    } = await mutate(`
      mutation {
        deleteAttributesGroupFromRubric(
          input: {
            rubricId: "${treeChild.id}"
            attributesGroupId: "${attributesGroup.id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            level
            attributesGroups {
              node {
                id
                name
              }
            }
          }
        }
      }
    `);
    expect(deleteAttributesGroupFromRubric.success).toBeTruthy();
    expect(deleteAttributesGroupFromRubric.rubric.attributesGroups.length).toEqual(1);*/
  });
});
