import { mutateWithImages, authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { anotherProduct, testProduct } from '../__fixtures__';
import { Upload } from '../../../types/upload';
import { generateTestProductAttributes } from '../../../utils/testUtils/generateTestProductAttributes';
import { gql } from 'apollo-server-express';
import { MOCK_PRODUCT_A, MOCK_PRODUCT_B, MOCK_ATTRIBUTE_WINE_COLOR } from '@yagu/mocks';

describe('Product', () => {
  it('Should CRUD product.', async () => {
    const { query, mutate } = await authenticatedTestClient();

    const connectionFragment = gql`
      fragment ConnectionFragment on ProductConnection {
        id
        key
        attributesGroupId
        attributeId
        attribute {
          id
          nameString
        }
        productsIds
        products {
          value
          node {
            id
            nameString
          }
        }
      }
    `;

    // Should return current product by slug
    const {
      data: { getProductBySlug },
    } = await query<any>(gql`
      query {
        getProductBySlug(slug: "${MOCK_PRODUCT_A.slug}") {
          id
          itemId
          nameString
          cardNameString
          slug
          descriptionString
          rubrics
          attributesGroups {
            node {
              id
            }
            attributes {
              node {
                id
                slug
              }
            }
          }
          connections {
            ...ConnectionFragment
          }
        }
      }
      ${connectionFragment}
    `);
    const {
      data: { getProductBySlug: secondaryProduct },
    } = await query<any>(gql`
      query {
        getProductBySlug(slug: "${MOCK_PRODUCT_B.slug}") {
          id
          itemId
          slug
        }
      }
    `);
    const currentProduct = getProductBySlug;
    expect(currentProduct.slug).toEqual(MOCK_PRODUCT_A.slug);

    // Should return product by ID
    const {
      data: { getProduct, getRubricsTree },
    } = await query<any>(gql`
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

    // Should create product connection
    const currentAttributesGroup = currentProduct.attributesGroups.find(({ attributes }: any) => {
      return attributes.find(({ node }: any) => node.slug === MOCK_ATTRIBUTE_WINE_COLOR.slug);
    });

    const currentAttribute = currentAttributesGroup.attributes.find(({ node }: any) => {
      return node.slug === MOCK_ATTRIBUTE_WINE_COLOR.slug;
    });

    const {
      data: { createProductConnection },
    } = await mutate<any>(
      gql`
        mutation CreateProductConnection($input: CreateProductConnectionInput!) {
          createProductConnection(input: $input) {
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
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            attributesGroupId: currentAttributesGroup.node.id,
            attributeId: currentAttribute.node.id,
            productId: currentProduct.id,
          },
        },
      },
    );
    const createdConnection = createProductConnection.product.connections[0];
    expect(createProductConnection.success).toBeTruthy();
    expect(createdConnection.productsIds).toHaveLength(1);

    // Should add product to connection
    const {
      data: { addProductToConnection },
    } = await mutate<any>(
      gql`
        mutation AddProductToConnection($input: AddProductToConnectionInput!) {
          addProductToConnection(input: $input) {
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
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            connectionId: createdConnection.id,
            productId: currentProduct.id,
            addProductId: secondaryProduct.id,
          },
        },
      },
    );
    expect(addProductToConnection.success).toBeTruthy();
    expect(addProductToConnection.product.connections[0].productsIds).toHaveLength(2);

    // Should delete product from connection
    const {
      data: { deleteProductFromConnection },
    } = await mutate<any>(
      gql`
        mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
          deleteProductFromConnection(input: $input) {
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
              connections {
                ...ConnectionFragment
              }
            }
          }
        }
        ${connectionFragment}
      `,
      {
        variables: {
          input: {
            connectionId: createdConnection.id,
            productId: currentProduct.id,
            addProductId: secondaryProduct.id,
          },
        },
      },
    );
    expect(deleteProductFromConnection.success).toBeTruthy();
    expect(deleteProductFromConnection.product.connections[0].productsIds).toHaveLength(1);

    // Should return paginated products.
    const {
      data: { getAllProducts },
    } = await query<any>(
      gql`
        query GetAllProducts($input: ProductPaginateInput!) {
          getAllProducts(input: $input) {
            docs {
              id
              itemId
              nameString
              cardNameString
              slug
              descriptionString
              rubrics
              connections {
                ...ConnectionFragment
              }
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
        ${connectionFragment}
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
    expect(getAllProducts.docs).toHaveLength(5);
    expect(getAllProducts.totalDocs).toEqual(5);

    // Should return features AST
    const {
      data: { getFeaturesAst },
    } = await query<any>(gql`
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
      mutation: gql`
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
        }
      `,
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
      mutation: gql`
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
        }
      `,
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
    } = await mutate<any>(
      gql`
        mutation DeleteProduct($id: ID!) {
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
