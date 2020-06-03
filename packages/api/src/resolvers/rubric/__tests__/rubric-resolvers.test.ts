// import { anotherRubric, testRubric } from '../__fixtures__';
import { getTestClientWithAuthenticatedUser } from '../../../utils/test-data/testHelpers';

describe.only('Rubrics', () => {
  it('Should rubrics CRUD', async () => {
    expect(true).toBeTruthy();
    const { query } = await getTestClientWithAuthenticatedUser();

    // Should return rubrics tree=
    const {
      data: {
        getRubricsTree,
        // getAllRubricVariants,
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
          slug
          level
          active
          variant {
            id
            name
          }
          parent {
            id
          }
          children {
            id
            name
          }
          attributesGroups {
            showInCatalogueFilter
            node {
              id
              name
            }
          }
        }
      }
    `);

    // const attributesGroup = getAllAttributesGroups[0];
    const treeParent = getRubricsTree[0];
    console.log(JSON.stringify(treeParent, null, 2));
    // const treeChild = treeParent.children[0];
    expect(getRubricsTree.length).toEqual(1);
    // expect(treeParent.name).toEqual(MOCK_RUBRIC_LEVEL_ONE.name);
    // expect(treeParent.children.length).toEqual(2);
    // expect(treeChild.name).toEqual(MOCK_RUBRIC_LEVEL_TWO.name);

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
    // expect(data.getRubric.name).toEqual(MOCK_RUBRIC_LEVEL_ONE.name);
    // expect(data.getRubric.catalogueName).toEqual(MOCK_RUBRIC_LEVEL_ONE.catalogueName);

    // Should create rubric
    /*const { mutate } = await getTestClientWithAuthenticatedUser();
    const {
      data: { createRubric },
    } = await mutate(`
      mutation {
        createRubric(
          input: {
            name: "${testRubric.name}"
            catalogueName: "${testRubric.catalogueName}"
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
    expect(createRubric.rubric.catalogueName).toEqual(testRubric.catalogueName);*/

    // Should update rubric
    /*const {
      data: { updateRubric },
    } = await mutate(`
      mutation {
        updateRubric(
          input: {
            id: "${createRubric.rubric.id}"
            name: "${anotherRubric.name}"
            catalogueName: "${anotherRubric.catalogueName}"
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
    expect(updateRubric.rubric.catalogueName).toEqual(anotherRubric.catalogueName);*/

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
