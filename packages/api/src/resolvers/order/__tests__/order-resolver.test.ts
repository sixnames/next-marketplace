import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { authenticatedTestClient } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import { CART_COOKIE_KEY } from '@yagu/config';

describe('Order', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  const cartFragment = gql`
    fragment Cart on Cart {
      id
      totalPrice
      formattedTotalPrice
      productsCount
    }
  `;

  it('Should CRUD Order', async () => {
    const { mutate } = await authenticatedTestClient();

    // Should create cart and add one product
    const addProductToCartPayload = await mutate<any>(
      gql`
        mutation AddProductToCart($input: AddProductToCartInput!) {
          addProductToCart(input: $input) {
            success
            message
            cart {
              ...Cart
            }
          }
        }
        ${cartFragment}
      `,
      {
        variables: {
          input: {
            shopProductId: mockData.shopAProductA.id,
            amount: 2,
          },
        },
      },
    );
    const {
      data: { addProductToCart },
    } = addProductToCartPayload;
    expect(addProductToCart.success).toBeTruthy();
    expect(addProductToCart.cart.productsCount).toEqual(1);

    // Set cart id to cookies
    const testClientWithHeaders = await authenticatedTestClient({
      headers: {
        cookie: `${CART_COOKIE_KEY}=${addProductToCart.cart.id}`,
      },
    });

    // Should add second product to cart
    const addProductToCartPayloadC = await testClientWithHeaders.mutate<any>(
      gql`
        mutation AddProductToCart($input: AddProductToCartInput!) {
          addProductToCart(input: $input) {
            success
            message
            cart {
              ...Cart
            }
          }
        }
        ${cartFragment}
      `,
      {
        variables: {
          input: {
            shopProductId: mockData.shopAProductB.id,
            amount: 10,
          },
        },
      },
    );
    expect(addProductToCartPayloadC.data.addProductToCart.cart.productsCount).toEqual(2);

    // Should make an order
    const makeAnOrderInput = {
      name: 'name',
      phone: '+7 999 888 77 66',
      email: 'order@email.com',
    };
    const makeAnOrderPayload = await testClientWithHeaders.mutate<any>(
      gql`
        mutation MakeAnOrder($input: MakeAnOrderInput!) {
          makeAnOrder(input: $input) {
            success
            message
            order {
              id
              itemId
              status {
                id
                nameString
              }
              customer {
                id
                name
                email
                phone
                user {
                  id
                  name
                }
              }
              logs {
                id
                createdAt
                variant
                executor {
                  id
                  name
                }
              }
              totalPrice
              formattedTotalPrice
              productsCount
              createdAt
              updatedAt
              products {
                id
                amount
                cardNameString
                nameString
                descriptionString
                discountedPercent
                formattedOldPrice
                formattedPrice
                formattedTotalPrice
                discountedPercent
                shopProduct {
                  id
                  available
                }
                shop {
                  id
                  nameString
                }
                company {
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
          input: makeAnOrderInput,
        },
      },
    );
    console.log(JSON.stringify(makeAnOrderPayload, null, 2));
    expect(makeAnOrderPayload.data.makeAnOrder.success).toBeTruthy();
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.name).toEqual(makeAnOrderInput.name);
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.phone).toEqual(
      makeAnOrderInput.phone,
    );
    expect(makeAnOrderPayload.data.makeAnOrder.order.customer.email).toEqual(
      makeAnOrderInput.email,
    );
  });
});
