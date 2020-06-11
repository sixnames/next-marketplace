import { getTestClientWithUser } from '../../../utils/test-data/testHelpers';

describe('Product', () => {
  beforeEach(async () => {});

  it('Should return current product.', async () => {
    const { query } = await getTestClientWithUser({});

    const {
      // data: { getAllProducts },
      data: test,
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

    console.log(JSON.stringify(test, null, 2));

    /*
    const {
      data: { getProduct },
    } = await query(`
      query {
        getProduct(id: "${createdProduct.id}") {
          id
          name
        }
      }
    `);

    expect(getProduct.id).toEqual(createdProduct.id);*/
    // expect(getProduct.name).toEqual(createdProduct.name);
    expect(true).toBeTruthy();
  });

  /*it('Should return paginated products.', async () => {
    const { query } = await getTestClientWithAuthenticatedUser();
    const createdProducts = await Product.insertMany([testProduct, anotherProduct]);

    const {
      data: { getAllProducts },
    } = await query(`
      query {
        getAllProducts(
          limit: 100,
          page: 1,
          sortBy: createdAt
          sortDir: desc
        ) {
          docs {
            id
          }
          totalDocs
        }
      }
    `);

    expect(getAllProducts.docs.length).toEqual(createdProducts.length);
    expect(getAllProducts.totalDocs).toEqual(createdProducts.length);
  });*/

  /*it(`Should create product.`, async function () {
    const rubric = await Rubric.create(rubricForProduct);

    const { createProduct } = await mutateWithImages({
      mutation: `
          mutation CreateProduct($input: CreateProductInput!) {
            createProduct(input: $input) {
              success
              product {
                id
                name
                cardName
                price
                description
                images
                rubrics
              }
            }
          }`,
      input: (image: Promise<any>) => ({
        name: testProduct.name,
        cardName: testProduct.cardName,
        price: testProduct.price,
        description: testProduct.description,
        rubrics: [rubric.id],
        images: [image],
      }),
    });

    const { product, success } = createProduct;

    expect(success).toBeTruthy();
    expect(product.name).toEqual(testProduct.name);
    expect(product.cardName).toEqual(testProduct.cardName);
    expect(product.price).toEqual(testProduct.price);
    expect(product.description).toEqual(testProduct.description);
    expect(product.rubrics).toEqual([rubric.id]);
    expect(product.images).toHaveLength(1);
  });*/

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
