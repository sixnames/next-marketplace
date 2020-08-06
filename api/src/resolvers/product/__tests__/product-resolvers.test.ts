import { testClientWithContext, mutateWithImages } from '../../../utils/testUtils/testHelpers';
import { anotherProduct, testProduct } from '../__fixtures__';
import { Upload } from '../../../types/upload';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';

describe('Product', () => {
  it('Should CRUD product.', async () => {
    const { query, mutate } = await testClientWithContext({});

    // Should return paginated products.
    const {
      data: { getAllProducts },
    } = await query(
      `
      query GetAllProducts($input: ProductPaginateInput!){
        getAllProducts(input: $input) {
          docs {
            id
            itemId
            nameString
            cardNameString
            slug
            descriptionString
            rubrics
            attributesGroups {
              showInCard
              node {
                id
                nameString
              }
              attributes {
                showInCard
                key
                node {
                  id
                  nameString
                }
                value
              }
            }
            assets {
              index
              url
            }
            price
            createdAt
            updatedAt
          }
          page
          totalDocs
        }
      }
    `,
      {
        variables: {
          input: {
            limit: 100,
            page: 1,
            sortBy: 'createdAt',
            sortDir: 'desc',
          },
        },
      },
    );
    const allProducts = getAllProducts.docs;
    const currentProduct = allProducts[0];
    expect(allProducts).toHaveLength(3);
    expect(getAllProducts.totalDocs).toEqual(3);

    // Should return current product
    const {
      data: { getProduct, getRubricsTree },
    } = await query(`
      query {
        getProduct(id: "${currentProduct.id}") {
          id
          nameString
          slug
        }
        getRubricsTree {
          id
          nameString
          children {
            id
            nameString
            attributesGroups {
              node {
                id
                attributes {
                  id
                  slug
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
              nameString
            }
          }
        }
      }
    `);
    const rubricLevelOne = getRubricsTree[0];
    const rubricLevelTwo = rubricLevelOne.children[0];
    const rubricLevelTree = rubricLevelTwo.children[0];
    expect(getProduct.id).toEqual(currentProduct.id);
    expect(getProduct.nameString).toEqual(currentProduct.nameString);
    const productAttributes = generateTestProductAttributes({ rubricLevelTwo });

    // Should return current product by slug
    const {
      data: { getProductBySlug },
    } = await query(`
      query {
        getProductBySlug(slug: "${currentProduct.slug}") {
          id
          nameString
        }
      }
    `);
    expect(getProductBySlug.id).toEqual(currentProduct.id);
    expect(getProductBySlug.nameString).toEqual(currentProduct.nameString);

    // Should return features AST
    const {
      data: { getFeaturesAst },
    } = await query(`
      query {
        getFeaturesAst(selectedRubrics: ["${rubricLevelOne.id}"]) {
          id
          nameString
          attributes {
            id
            nameString
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
    `);
    expect(getFeaturesAst).toHaveLength(1);

    // Should create product.
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
                itemId
                nameString
                cardNameString
                slug
                descriptionString
                rubrics
                attributesGroups {
                  showInCard
                  node {
                    id
                    nameString
                  }
                  attributes {
                    showInCard
                    key
                    node {
                      id
                      nameString
                    }
                    value
                  }
                }
                assets {
                  index
                  url
                }
                price
              }
            }
          }`,
      input: (images: Promise<Upload>[]) => {
        return {
          name: testProduct.name,
          cardName: testProduct.cardName,
          price: testProduct.price,
          description: testProduct.description,
          rubrics: [rubricLevelTree.id],
          assets: images,
          ...productAttributes,
        };
      },
    });

    const { product: createdProduct, success: createSuccess } = createProduct;

    expect(createSuccess).toBeTruthy();
    expect(createdProduct.nameString).toEqual(testProduct.name[0].value);
    expect(createdProduct.cardNameString).toEqual(testProduct.cardName[0].value);
    expect(createdProduct.descriptionString).toEqual(testProduct.description[0].value);
    expect(createdProduct.price).toEqual(testProduct.price);
    expect(createdProduct.rubrics).toEqual([rubricLevelTree.id]);
    expect(createdProduct.assets).toHaveLength(3);

    // Should update product.
    const {
      data: { updateProduct },
    } = await mutateWithImages({
      mutation: `
          mutation UpdateProduct($input: UpdateProductInput!) {
            updateProduct(input: $input) {
              success
              message
              product {
                id
                itemId
                nameString
                cardNameString
                slug
                descriptionString
                rubrics
                attributesGroups {
                  showInCard
                  node {
                    id
                    nameString
                  }
                  attributes {
                    showInCard
                    key
                    node {
                      id
                      nameString
                    }
                    value
                  }
                }
                assets {
                  index
                  url
                }
                price
              }
            }
          }`,
      input: (images: Promise<Upload>[]) => {
        return {
          id: createdProduct.id,
          name: anotherProduct.name,
          cardName: anotherProduct.cardName,
          price: anotherProduct.price,
          description: anotherProduct.description,
          rubrics: [rubricLevelTree.id],
          assets: images,
          ...productAttributes,
        };
      },
    });

    const { product: updatedProduct, success: updateSuccess } = updateProduct;

    expect(updateSuccess).toBeTruthy();
    expect(updatedProduct.nameString).toEqual(anotherProduct.name[0].value);
    expect(updatedProduct.cardNameString).toEqual(anotherProduct.cardName[0].value);
    expect(updatedProduct.descriptionString).toEqual(anotherProduct.description[0].value);
    expect(updatedProduct.price).toEqual(anotherProduct.price);
    expect(updatedProduct.rubrics).toEqual([rubricLevelTree.id]);
    expect(updatedProduct.assets).toHaveLength(3);

    // Should delete product
    const {
      data: { deleteProduct },
    } = await mutate(
      `
        mutation DeleteProduct($id: ID!){
          deleteProduct(id: $id) {
            success
            message
          }
        }
      `,
      {
        variables: {
          id: updatedProduct.id,
        },
      },
    );

    expect(deleteProduct.success).toBeTruthy();
  });
});
