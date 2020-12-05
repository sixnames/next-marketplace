import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
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

  const shopSnippetFragment = gql`
    fragment ShopSnippet on Shop {
      id
      nameString
      slug
    }
  `;

  const shopProductSnippetFragment = gql`
    fragment ShopProductSnippet on ShopProduct {
      id
      itemId
      shop {
        ...ShopSnippet
      }
    }
    ${shopSnippetFragment}
  `;

  const cartFragment = gql`
    fragment Cart on Cart {
      id
      totalPrice
      formattedTotalPrice
      productsCount
      products {
        id
        amount
        shopProduct {
          ...ShopProductSnippet
        }
      }
    }
    ${shopProductSnippetFragment}
  `;

  it('Should CRUD Order', async () => {
    const { mutate } = await testClientWithContext();

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
    const testClientWithHeaders = await testClientWithContext({
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
  });
});
