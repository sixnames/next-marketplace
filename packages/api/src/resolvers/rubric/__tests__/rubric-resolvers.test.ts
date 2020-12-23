import { anotherRubric, testProduct, testRubric } from '../__fixtures__';
import { authenticatedTestClient, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import getLangField from '../../../utils/translations/getLangField';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { Upload } from '../../../types/upload';
import { gql } from 'apollo-server-express';
import createTestData from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { DEFAULT_LANG, MOCK_RUBRIC_LEVEL_ONE, MOCK_RUBRIC_LEVEL_TWO_A } from '@yagu/shared';

describe('Rubrics', () => {
  beforeEach(async () => {
    await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should rubrics CRUD', async () => {
    expect(true).toBeTruthy();
    const { query } = await authenticatedTestClient();

    // Should return rubrics tree
    const {
      data: { getRubricsTree, getAllRubricVariants, getAllAttributesGroups },
    } = await query<any>(gql`
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
          nameString
          totalProductsCount
          activeProductsCount
          children {
            id
            nameString
            totalProductsCount
            activeProductsCount
            attributesGroups {
              node {
                id
                attributes {
                  id
                  slug
                  variant
                  optionsGroup {
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
              nameString
              totalProductsCount
              activeProductsCount
              products {
                docs {
                  id
                }
              }
            }
          }
        }
      }
    `);

    const attributesGroup = getAllAttributesGroups[0];
    const rubricLevelOne = getRubricsTree[0];
    // console.log(JSON.stringify(rubricLevelOne, null, 2));
    const rubricLevelTwo = rubricLevelOne.children[0];
    const rubricLevelThree = rubricLevelTwo.children[0];
    const rubricLevelTreeForNewProduct = rubricLevelTwo.children[1];
    expect(getRubricsTree.length).toEqual(4);
    expect(rubricLevelOne.nameString).toEqual(
      getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG),
    );
    expect(rubricLevelOne.children.length).toEqual(2);
    expect(rubricLevelTwo.nameString).toEqual(
      getLangField(MOCK_RUBRIC_LEVEL_TWO_A.name, DEFAULT_LANG),
    );

    // Should return current rubric and it's products
    const { data } = await query<any>(gql`
      query {
        getRubric(id: "${rubricLevelOne.id}") {
          id
          slug
          nameString
          catalogueTitleString {
            defaultTitle
            prefix
            keyword
            gender
          }
          products {
            totalDocs
            page
            totalPages
            activeProductsCount
            docs {
              id
              rubrics
              itemId
              nameString
              price
              slug
              mainImage
              active
            }
          }
        }
      }
    `);
    expect(data.getRubric.id).toEqual(rubricLevelOne.id);
    expect(data.getRubric.nameString).toEqual(
      getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG),
    );
    expect(data.getRubric.products.docs).toBeDefined();

    // Should return current rubric by slug
    const {
      data: { getRubricBySlug },
    } = await query<any>(gql`
      query {
        getRubricBySlug(slug: "${data.getRubric.slug}") {
          id
          nameString
          catalogueTitleString {
            defaultTitle
            prefix
            keyword
            gender
          }
        }
      }
    `);
    expect(getRubricBySlug.id).toEqual(rubricLevelOne.id);
    expect(getRubricBySlug.nameString).toEqual(
      getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG),
    );

    // Should return duplicate rubric error on rubric create
    const { mutate } = await authenticatedTestClient();
    const duplicateName = getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG);
    const { data: exists } = await mutate<any>(gql`
      mutation {
        createRubric(
          input: {
            name: [{key: "${DEFAULT_LANG}", value: "${duplicateName}"}]
            catalogueTitle: {
              defaultTitle: [{key: "${DEFAULT_LANG}", value: "test"}],
              prefix: [],
              keyword: [{key: "${DEFAULT_LANG}", value: "test"}],
              gender: ${MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender},
            }
            variant: "${getAllRubricVariants[0].id}"
          }
        ) {
          success
          message
          rubric {
            id
            nameString
          }
        }
      }
    `);
    expect(exists.createRubric.success).toBeFalsy();

    // Should create rubric
    const {
      data: { createRubric },
    } = await mutate<any>(gql`
      mutation {
        createRubric(
          input: {
            name: [{key: "${DEFAULT_LANG}", value: "${testRubric.name}"}]
            catalogueTitle: {
              defaultTitle: [{key: "${DEFAULT_LANG}", value: "test"}],
              prefix: [],
              keyword: [{key: "${DEFAULT_LANG}", value: "test"}],
              gender: ${MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender},
            }
            variant: "${getAllRubricVariants[0].id}"
          }
        ) {
          success
          message
          rubric {
            id
            nameString
            catalogueTitleString {
              defaultTitle
              prefix
              keyword
              gender
            }
            variant {
              id
              nameString
            }
          }
        }
      }
    `);
    expect(createRubric.success).toBeTruthy();
    expect(createRubric.rubric.nameString).toEqual(testRubric.name);

    // Should return duplicate rubric error on rubric update
    const duplicateNameOnUpdate = getLangField(MOCK_RUBRIC_LEVEL_ONE.name, DEFAULT_LANG);
    const {
      data: { updateRubric: falseUpdateRubric },
    } = await mutate<any>(gql`
      mutation {
        updateRubric(
          input: {
            id: "${createRubric.rubric.id}"
            name: [{key: "${DEFAULT_LANG}", value: "${duplicateNameOnUpdate}"}]
            catalogueTitle: {
              defaultTitle: [{key: "${DEFAULT_LANG}", value: "test"}],
              prefix: [],
              keyword: [{key: "${DEFAULT_LANG}", value: "test"}],
              gender: ${MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender},
            }
            variant: "${createRubric.rubric.variant.id}"
          }
        ) {
          success
          message
          rubric {
            id
            nameString
          }
        }
      }
    `);
    expect(falseUpdateRubric.success).toBeFalsy();

    // Should update rubric
    const {
      data: { updateRubric },
    } = await mutate<any>(gql`
      mutation {
        updateRubric(
          input: {
            id: "${createRubric.rubric.id}"
            name: [{key: "${DEFAULT_LANG}", value: "${anotherRubric.name}"}]
            catalogueTitle: {
              defaultTitle: [{key: "${DEFAULT_LANG}", value: "test"}],
              prefix: [],
              keyword: [{key: "${DEFAULT_LANG}", value: "test"}],
              gender: ${MOCK_RUBRIC_LEVEL_ONE.catalogueTitle.gender},
            }
            variant: "${createRubric.rubric.variant.id}"
          }
        ) {
          success
          message
          rubric {
            id
            nameString
            catalogueTitleString {
              defaultTitle
              prefix
              keyword
              gender
            }
          }
        }
      }
    `);
    expect(updateRubric.success).toBeTruthy();
    expect(updateRubric.rubric.nameString).toEqual(anotherRubric.name);

    // Should add attributes group to the second level rubric
    const {
      data: {
        addAttributesGroupToRubric: { rubric, success },
      },
    } = await mutate<any>(gql`
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
            nameString
            level
            attributesGroups {
              showInCatalogueFilter
              isOwner
              node {
                id
                nameString
                attributes {
                  id
                }
              }
            }
          }
        }
      }
    `);

    const { attributesGroups } = rubric;
    const addedAttributesGroup = attributesGroups.find((group: any) => {
      return group.node.id === attributesGroup.id;
    });
    expect(success).toBeTruthy();

    // Should update attributes group in rubric
    const {
      data: { updateAttributesGroupInRubric },
    } = await mutate<any>(gql`
      mutation {
        updateAttributesGroupInRubric(
          input: {
            rubricId: "${rubricLevelTwo.id}"
            attributesGroupId: "${attributesGroup.id}"
            attributeId: "${addedAttributesGroup.showInCatalogueFilter[0]}"
          }
        ) {
          success
          message
          rubric {
            id
            nameString
            level
            attributesGroups {
              showInCatalogueFilter
              node {
                id
                nameString
              }
            }
          }
        }
      }
    `);
    expect(updateAttributesGroupInRubric.success).toBeTruthy();
    const updatedGroup: any = updateAttributesGroupInRubric.rubric.attributesGroups.find(
      ({ node }: any) => {
        return node.id === attributesGroup.id;
      },
    );
    expect(updatedGroup.showInCatalogueFilter).toHaveLength(1);

    // Should delete attributes group from rubric
    const {
      data: { deleteAttributesGroupFromRubric },
    } = await mutate<any>(gql`
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
            nameString
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

    // Should add product to the third level rubric
    const productAttributes = generateTestProductAttributes({ rubric: rubricLevelTwo });

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
          originalName: testProduct.originalName,
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
    } = await mutate<any>(gql`
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
            nameString
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

    // Should return added product to third level rubric on first level
    const { data: firstLevelRubricProducts } = await query<any>(gql`
      query {
        getRubric(id: "${rubricLevelOne.id}") {
          id
          products {
            docs {
              id
            }
          }
        }
      }
    `);
    const firstLevelRubricProductsIds = firstLevelRubricProducts.getRubric.products.docs.map(
      (product: any) => product.id,
    );
    const productOnFirstLevelRubric = firstLevelRubricProductsIds.find(
      (id: string) => id === createdProduct.id,
    );
    expect(productOnFirstLevelRubric).toBeDefined();

    // Should delete product from third level rubric
    const {
      data: { deleteProductFromRubric },
    } = await mutate<any>(gql`
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
            nameString
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

    // Should delete rubric
    const {
      data: { deleteRubric },
    } = await mutate<any>(gql`
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
