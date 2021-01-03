import { authenticatedTestClient, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import getLangField from '../../../utils/translations/getLangField';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { Upload } from '../../../types/upload';
import { gql } from 'apollo-server-express';
import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { DEFAULT_LANG, GENDER_IT, SECONDARY_LANG } from '@yagu/shared';
import { fakerRu } from '../../../utils/testUtils/fakerLocales';
import faker from 'faker';

describe('Rubrics', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should rubrics CRUD', async () => {
    expect(true).toBeTruthy();
    const { query } = await authenticatedTestClient();

    // Should return rubrics tree
    const rubricsTreePayload = await query<any>(gql`
      query {
        getRubricsTree {
          id
          slug
          nameString
          totalProductsCount
          activeProductsCount
          children {
            id
            slug
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
              slug
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

    const {
      data: { getRubricsTree },
    } = rubricsTreePayload;
    expect(getRubricsTree.length).toEqual(
      [
        mockData.rubricLevelOneA,
        mockData.rubricLevelOneB,
        mockData.rubricLevelOneC,
        mockData.rubricLevelOneD,
      ].length,
    );

    const rubricLevelOne = getRubricsTree[0];
    const rubricLevelTwo = rubricLevelOne.children[0];
    const rubricLevelThree = rubricLevelTwo.children[0];
    const rubricLevelThreeForNewProduct = mockData.rubricLevelThreeAB;

    // Should return current rubric and it's products
    const getRubricPayload = await query<any>(
      gql`
        query GetRubric($id: ID!) {
          getRubric(id: $id) {
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
      `,
      {
        variables: {
          id: rubricLevelOne.id,
        },
      },
    );
    expect(getRubricPayload.data.getRubric.id).toEqual(rubricLevelOne.id);
    expect(getRubricPayload.data.getRubric.nameString).toEqual(
      getLangField(mockData.rubricLevelOneA.name, DEFAULT_LANG),
    );
    expect(getRubricPayload.data.getRubric.products.docs).toBeDefined();

    // Should return current rubric by slug
    const getRubricBySlugPayload = await query<any>(
      gql`
        query GetRubricBySlug($slug: String!) {
          getRubricBySlug(slug: $slug) {
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
      `,
      {
        variables: {
          slug: rubricLevelOne.slug,
        },
      },
    );
    expect(getRubricBySlugPayload.data.getRubricBySlug.id).toEqual(rubricLevelOne.id);
    expect(getRubricBySlugPayload.data.getRubricBySlug.nameString).toEqual(
      mockData.rubricLevelOneADefaultName,
    );

    // Should return duplicate rubric error on rubric create
    const { mutate } = await authenticatedTestClient();
    const { data: exists } = await mutate<any>(
      gql`
        mutation CreateRubric($input: CreateRubricInput!) {
          createRubric(input: $input) {
            success
            message
            rubric {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            name: mockData.rubricLevelOneAName,
            catalogueTitle: {
              defaultTitle: [],
              prefix: [],
              keyword: [],
              gender: mockData.rubricLevelOneA.catalogueTitle.gender,
            },
            variant: mockData.rubricVariantAlcohol.id,
          },
        },
      },
    );
    expect(exists.createRubric.success).toBeFalsy();

    // Should create rubric
    const newRubricName = fakerRu.commerce.department();
    const createRubricPayload = await mutate<any>(
      gql`
        mutation CreateRubric($input: CreateRubricInput!) {
          createRubric(input: $input) {
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
      `,
      {
        variables: {
          input: {
            name: [{ key: DEFAULT_LANG, value: newRubricName }],
            catalogueTitle: {
              defaultTitle: [{ key: DEFAULT_LANG, value: newRubricName }],
              prefix: [],
              keyword: [{ key: DEFAULT_LANG, value: newRubricName }],
              gender: GENDER_IT,
            },
            variant: mockData.rubricVariantAlcohol.id,
          },
        },
      },
    );
    const {
      data: { createRubric },
    } = createRubricPayload;
    expect(createRubric.success).toBeTruthy();
    expect(createRubric.rubric.nameString).toEqual(newRubricName);

    // Should return duplicate rubric error on rubric update
    const updateRubricErrorPayload = await mutate<any>(
      gql`
        mutation UpdateRubric($input: UpdateRubricInput!) {
          updateRubric(input: $input) {
            success
            message
            rubric {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createRubric.rubric.id,
            name: mockData.rubricLevelOneAName,
            catalogueTitle: {
              defaultTitle: [],
              prefix: [],
              keyword: [],
              gender: GENDER_IT,
            },
            variant: mockData.rubricVariantAlcohol.id,
          },
        },
      },
    );
    expect(updateRubricErrorPayload.data.updateRubric.success).toBeFalsy();

    // Should update rubric
    const rubricNewName = 'rubricNewName';
    const updateRubricPayload = await mutate<any>(
      gql`
        mutation UpdateRubric($input: UpdateRubricInput!) {
          updateRubric(input: $input) {
            success
            message
            rubric {
              id
              nameString
            }
          }
        }
      `,
      {
        variables: {
          input: {
            id: createRubric.rubric.id,
            name: [{ key: DEFAULT_LANG, value: rubricNewName }],
            catalogueTitle: {
              defaultTitle: [],
              prefix: [],
              keyword: [],
              gender: GENDER_IT,
            },
            variant: mockData.rubricVariantAlcohol.id,
          },
        },
      },
    );
    const {
      data: { updateRubric },
    } = updateRubricPayload;
    expect(updateRubric.success).toBeTruthy();
    expect(updateRubric.rubric.nameString).toEqual(rubricNewName);

    // Should add attributes group to the second level rubric
    const rubricNewAttributesGroupId = mockData.attributesGroupForDelete.id;
    const {
      data: { addAttributesGroupToRubric },
    } = await mutate<any>(
      gql`
        mutation AddAttributesGroupToRubric($input: AddAttributesGroupToRubricInput!) {
          addAttributesGroupToRubric(input: $input) {
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
      `,
      {
        variables: {
          input: {
            rubricId: rubricLevelTwo.id,
            attributesGroupId: rubricNewAttributesGroupId,
          },
        },
      },
    );
    expect(addAttributesGroupToRubric.success).toBeTruthy();

    // Should update attributes group in rubric
    const updateAttributesGroupInRubricPayload = await mutate<any>(
      gql`
        mutation UpdateAttributesGroupInRubric($input: UpdateAttributesGroupInRubricInput!) {
          updateAttributesGroupInRubric(input: $input) {
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
      `,
      {
        variables: {
          input: {
            rubricId: rubricLevelTwo.id,
            attributesGroupId: rubricNewAttributesGroupId,
            attributeId: mockData.attributesGroupForDelete.attributes[0].toString(),
          },
        },
      },
    );
    const {
      data: { updateAttributesGroupInRubric },
    } = updateAttributesGroupInRubricPayload;
    expect(updateAttributesGroupInRubric.success).toBeTruthy();
    const updatedGroup: any = updateAttributesGroupInRubric.rubric.attributesGroups.find(
      ({ node }: any) => {
        return node.id === mockData.attributesGroupForDelete.id;
      },
    );
    expect(updatedGroup.showInCatalogueFilter).toHaveLength(1);

    // Should delete attributes group from rubric
    const {
      data: { deleteAttributesGroupFromRubric },
    } = await mutate<any>(
      gql`
        mutation DeleteAttributesGroupFromRubric($input: DeleteAttributesGroupFromRubricInput!) {
          deleteAttributesGroupFromRubric(input: $input) {
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
      `,
      {
        variables: {
          input: {
            rubricId: rubricLevelTwo.id,
            attributesGroupId: rubricNewAttributesGroupId,
          },
        },
      },
    );
    expect(deleteAttributesGroupFromRubric.success).toBeTruthy();

    // Should add product to the third level rubric
    const productAttributes = generateTestProductAttributes({ rubric: rubricLevelTwo });

    // Create new product for rubric.
    const newProductName = faker.commerce.productName();
    const newProductDescription = faker.commerce.productDescription();
    const newProduct = {
      name: [
        { key: DEFAULT_LANG, value: newProductName },
        { key: SECONDARY_LANG, value: newProductName },
      ],
      cardName: [
        { key: DEFAULT_LANG, value: newProductName },
        { key: SECONDARY_LANG, value: newProductName },
      ],
      originalName: newProductName,
      description: [
        { key: DEFAULT_LANG, value: newProductDescription },
        { key: SECONDARY_LANG, value: newProductDescription },
      ],
    };
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
          name: newProduct.name,
          cardName: newProduct.cardName,
          originalName: newProduct.originalName,
          description: newProduct.description,
          rubrics: [rubricLevelThreeForNewProduct.id],
          manufacturer: mockData.manufacturerA.slug,
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
