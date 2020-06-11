import { getTestClientWithUser, mutateWithImages } from '../../../utils/test-data/testHelpers';
import { testProduct } from '../__fixtures__';
import {
  ATTRIBUTE_TYPE_MULTIPLE_SELECT,
  ATTRIBUTE_TYPE_NUMBER,
  ATTRIBUTE_TYPE_SELECT,
  ATTRIBUTE_TYPE_STRING,
} from '@rg/config';
import { Upload } from '../../../types/upload';

describe('Product', () => {
  it('Should CRUD product.', async () => {
    const { query } = await getTestClientWithUser({});

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
            name
            cardName
            slug
            description
            rubrics
            attributesSource
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
    const createdProduct = allProducts[0];
    expect(allProducts).toHaveLength(3);
    expect(getAllProducts.totalDocs).toEqual(3);

    // Should return current product
    const {
      data: { getProduct, getRubricsTree },
    } = await query(`
      query {
        getProduct(id: "${createdProduct.id}") {
          id
          name
        }
        getRubricsTree {
          id
          name
          children {
            id
            name
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
            }
          }
        }
      }
    `);
    const rubricLevelOne = getRubricsTree[0];
    const rubricLevelTwo = rubricLevelOne.children[0];
    const rubricLevelTree = rubricLevelTwo.children[0];
    expect(getProduct.id).toEqual(createdProduct.id);
    expect(getProduct.name).toEqual(createdProduct.name);

    const productAttributes = {
      attributesSource: rubricLevelTwo.id,
      attributesGroups: rubricLevelTwo.attributesGroups.map(({ node }: { [key: string]: any }) => {
        const { id, attributes } = node;
        return {
          node: id,
          showInCard: true,
          attributes: attributes.map(({ id, itemId, variant, options }: { [key: string]: any }) => {
            let value = [];

            if (variant === ATTRIBUTE_TYPE_MULTIPLE_SELECT) {
              value = options.options.map(({ id }: { id: string }) => id);
            }

            if (variant === ATTRIBUTE_TYPE_SELECT) {
              value = options.options[0].id;
            }

            if (variant === ATTRIBUTE_TYPE_STRING) {
              value = ['string'];
            }

            if (variant === ATTRIBUTE_TYPE_NUMBER) {
              value = ['123'];
            }

            return {
              node: id,
              showInCard: true,
              key: itemId,
              value,
            };
          }),
        };
      }),
    };

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
                name
                cardName
                slug
                description
                rubrics
                attributesSource
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
    console.log(createProduct);
    // const { product, success } = createProduct;

    // expect(success).toBeTruthy();
    // expect(product.name).toEqual(testProduct.name[0].value);
    // expect(product.cardName).toEqual(testProduct.cardName[0].value);
    // expect(product.description).toEqual(testProduct.description[0].value);
    // expect(product.price).toEqual(testProduct.price);
    // expect(product.rubrics).toEqual([rubricLevelTree.id]);
    // expect(product.assets).toHaveLength(1);
  });

  /*it(`Should update product.`, async function () {
    const { mutate } = await getTestClientWithAuthenticatedUser();
    const createdProduct = await Product.create(testProduct);

    const {
      data: {
        updateProduct: { success, product },
      },
    } = await mutate(
      `
      mutation UpdateProduct($input: UpdateProductInput!){
        updateProduct(input: $input) {
          success
          product {
            id
            name
          }
        }
      }
    `,
      {
        variables: {
          input: {
            id: createdProduct.id,
            name: anotherProduct.name,
          },
        },
      },
    );

    expect(success).toBeTruthy();
    expect(product.name).toEqual(anotherProduct.name);
    expect(product.id).toEqual(createdProduct.id);
  });*/

  /*it(`Should delete product.`, async function () {
    const createdProduct = await Product.create(testProduct);
    const { mutate } = await getTestClientWithAuthenticatedUser();

    const {
      data: {
        deleteProduct: { success },
      },
    } = await mutate(
      `
    mutation DeleteProduct($input: DeleteProductInput!){
      deleteProduct(input: $input) {
        success
      }
    }
  `,
      {
        variables: {
          input: {
            id: createdProduct.id,
          },
        },
      },
    );

    expect(success).toBeTruthy();
  });*/
});
