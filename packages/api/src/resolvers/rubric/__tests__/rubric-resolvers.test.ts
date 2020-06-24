import { anotherRubric, testProduct, testRubric } from '../__fixtures__';
import {
  getTestClientWithAuthenticatedUser,
  mutateWithImages,
} from '../../../utils/testUtils/testHelpers';
import getLangField from '../../../utils/getLangField';
import { DEFAULT_LANG, MOCK_RUBRIC_LEVEL_ONE, MOCK_RUBRIC_LEVEL_TWO } from '../../../config';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { Upload } from '../../../types/upload';

describe.only('Rubrics', () => {
  it('Should rubrics CRUD', async () => {
    expect(true).toBeTruthy();
    const { query } = await getTestClientWithAuthenticatedUser();

    // Should return rubrics tree
    const {
      data: { getRubricsTree, getAllRubricVariants, getAllAttributesGroups },
    } = await query(`
      query {
        getAllRubricVariants {
          id
          nameString
        }
        getAllAttributesGroups {
          id
          nameString
        }
        getRubricsTree {
          id
          name
          totalProductsCount
          activeProductsCount
          children {
            id
            name
            totalProductsCount
            activeProductsCount
            attributesGroups {
              node {
                id
                attributes {
                  id
                  itemId
                  variant
                  options {
                    id
                    options {
                      id
                    }
                  }
                }
              }
            }
            children {
              id
              name
              totalProductsCount
              activeProductsCount
              products {
                docs { id }
              }
            }
          }
        }
      }
    `);

    const attributesGroup = getAllAttributesGroups[0];
    const rubricLevelOne = getRubricsTree[0];
    const rubricLevelTwo = rubricLevelOne.children[0];
    const rubricLevelThree = rubricLevelTwo.children[0];
    const rubricLevelTreeForNewProduct = rubricLevelTwo.children[1];
    expect(getRubricsTree.length).toEqual(1);
    expect(rubricLevelOne.name).toEqual(getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG));
    expect(rubricLevelOne.children.length).toEqual(2);
    expect(rubricLevelTwo.name).toEqual(getLangField(MOCK_RUBRIC_LEVEL_TWO.name, DEFAULT_LANG));

    // Should return current rubric
    const { data } = await query(`
      query {
        getRubric(id: "${rubricLevelOne.id}") {
          id
          name
          catalogueName
        }
      }
    `);
    expect(data.getRubric.id).toEqual(rubricLevelOne.id);
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
              nameString
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

    // Should add attributes group to the second level rubric
    const {
      data: {
        addAttributesGroupToRubric: { rubric, success },
      },
    } = await mutate(`
      mutation {
        addAttributesGroupToRubric(
          input: {
            rubricId: "${rubricLevelTwo.id}"
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
                nameString
              }
            }
          }
        }
      }
    `);
    const { attributesGroups } = rubric;
    expect(success).toBeTruthy();
    expect(attributesGroups.length).toEqual(2);

    // Should delete attributes group from rubric
    const {
      data: { deleteAttributesGroupFromRubric },
    } = await mutate(`
      mutation {
        deleteAttributesGroupFromRubric(
          input: {
            rubricId: "${rubricLevelTwo.id}"
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
                nameString
              }
            }
          }
        }
      }
    `);
    expect(deleteAttributesGroupFromRubric.success).toBeTruthy();
    expect(deleteAttributesGroupFromRubric.rubric.attributesGroups.length).toEqual(1);

    // Should add product to the third level rubric
    const productAttributes = generateTestProductAttributes({ rubricLevelTwo });

    // Create new product for rubric.
    const {
      data: { createProduct },
    } = await mutateWithImages({
      mutation: `
          mutation CreateProduct($input: CreateProductInput!) {
            createProduct(input: $input) {
              success
              message
              product {
                id
              }
            }
          }`,
      input: (images: Promise<Upload>[]) => {
        return {
          name: testProduct.name,
          cardName: testProduct.cardName,
          price: testProduct.price,
          description: testProduct.description,
          rubrics: [rubricLevelTreeForNewProduct.id],
          assets: images,
          ...productAttributes,
        };
      },
    });
    const { product: createdProduct } = createProduct;

    const {
      data: { addProductToRubric },
    } = await mutate(`
      mutation {
        addProductToRubric(
          input: {
            rubricId: "${rubricLevelThree.id}"
            productId: "${createdProduct.id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            level
            products {
              docs {
                id
              }
            }
          }
        }
      }
    `);
    expect(addProductToRubric.success).toBeTruthy();
    expect(addProductToRubric.rubric.products.docs.length).toEqual(
      rubricLevelThree.products.docs.length + 1,
    );

    // Should delete product from third level rubric
    const {
      data: { deleteProductFromRubric },
    } = await mutate(`
      mutation {
        deleteProductFromRubric(
          input: {
            rubricId: "${rubricLevelThree.id}"
            productId: "${createdProduct.id}"
          }
        ) {
          success
          message
          rubric {
            id
            name
            level
            products {
              docs {
                id
              }
            }
          }
        }
      }
    `);
    expect(deleteProductFromRubric.success).toBeTruthy();
    expect(deleteProductFromRubric.rubric.products.docs.length).toEqual(
      rubricLevelThree.products.docs.length,
    );

    // Should return features AST for current rubric
    const {
      data: { getFeaturesASTOptions },
    } = await query(`
      query {
        getFeaturesASTOptions(selected: ["${rubricLevelThree.id}"]) {
          id
          nameString
          attributesGroups {
            node {
              id
              nameString
              attributes {
                id
                itemId
                nameString
                variant
                metric {
                  id
                  nameString
                }
                options {
                  id
                  nameString
                  options {
                    id
                    nameString
                    color
                  }
                }
              }
            }
          }
        }
      }
    `);

    expect(getFeaturesASTOptions[0].id).toEqual(rubricLevelTwo.id);
    expect(getFeaturesASTOptions[0].attributesGroups).toHaveLength(1);
    expect(getFeaturesASTOptions[0].attributesGroups[0].node.attributes).toHaveLength(4);

    // Should delete rubric
    const {
      data: { deleteRubric },
    } = await mutate(`
      mutation {
        deleteRubric(
          id: "${rubricLevelOne.id}"
        ) {
          success
        }
      }
    `);
    expect(deleteRubric.success).toBeTruthy();
  });
});
