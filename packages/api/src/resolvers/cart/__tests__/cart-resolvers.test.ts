import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import { testClientWithContext } from '../../../utils/testUtils/testHelpers';
import { gql } from 'apollo-server-express';
import { CART_COOKIE_KEY } from '@yagu/config';

describe('Cart', () => {
  let mockData: CreateTestDataPayloadInterface;
  beforeEach(async () => {
    mockData = await createTestData();
  });

  afterEach(async () => {
    await clearTestData();
  });

  it('Should CRUD Cart', async () => {
    const { mutate } = await testClientWithContext();

    const shopSnippetFragment = gql`
      fragment ShopSnippet on Shop {
        id
        nameString
        slug
        productsCount
        address {
          formattedAddress
          formattedCoordinates {
            lat
            lng
          }
        }
        contacts {
          formattedPhones {
            raw
            readable
          }
        }
        assets {
          index
          url
        }
        logo {
          index
          url
        }
      }
    `;

    const shopProductSnippetFragment = gql`
      fragment ShopProductSnippet on ShopProduct {
        id
        itemId
        available
        formattedPrice
        formattedOldPrice
        discountedPercent
        shop {
          ...ShopSnippet
        }
      }
      ${shopSnippetFragment}
    `;

    const cartFragment = gql`
      fragment Cart on Cart {
        id
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
            amount: 1,
          },
        },
      },
    );
    const {
      data: { addProductToCart },
    } = addProductToCartPayload;
    expect(addProductToCart.success).toBeTruthy();
    expect(addProductToCart.cart.products).toHaveLength(1);

    // Set cart id to cookies
    const testClientWithHeaders = await testClientWithContext({
      headers: {
        cookie: `${CART_COOKIE_KEY}=${addProductToCart.cart.id}`,
        referer: '',
      },
    });

    // Should increase product in cart
    const addProductToCartPayloadB = await testClientWithHeaders.mutate<any>(
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
            amount: 1,
          },
        },
      },
    );
    const updatedCartProduct = addProductToCartPayloadB.data.addProductToCart.cart.products.find(
      (product: any) => {
        const { shopProduct } = product;
        return shopProduct.id === mockData.shopAProductA.id;
      },
    );
    expect(updatedCartProduct.amount).toEqual(2);
    expect(addProductToCartPayloadB.data.addProductToCart.success).toBeTruthy();

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
    const secondCartProduct = addProductToCartPayloadC.data.addProductToCart.cart.products.find(
      (product: any) => {
        const { shopProduct } = product;
        return shopProduct.id === mockData.shopAProductB.id;
      },
    );
    expect(secondCartProduct.amount).toEqual(10);
    expect(addProductToCartPayloadC.data.addProductToCart.success).toBeTruthy();
    expect(addProductToCartPayloadC.data.addProductToCart.cart.products).toHaveLength(2);

    // Should update second product in cart
    const nowProductAmount = 3;
    const updateProductInCartPayload = await testClientWithHeaders.mutate<any>(
      gql`
        mutation UpdateProductInCart($input: UpdateProductInCartInput!) {
          updateProductInCart(input: $input) {
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
            amount: nowProductAmount,
          },
        },
      },
    );
    const updatedProductInCart = updateProductInCartPayload.data.updateProductInCart.cart.products.find(
      (product: any) => {
        const { shopProduct } = product;
        return shopProduct.id === mockData.shopAProductB.id;
      },
    );
    expect(updatedProductInCart.amount).toEqual(nowProductAmount);
    expect(updateProductInCartPayload.data.updateProductInCart.success).toBeTruthy();

    // Should delete second product from cart
    const deleteProductFromCartPayload = await testClientWithHeaders.mutate<any>(
      gql`
        mutation DeleteProductFromCart($input: DeleteProductFromCartInput!) {
          deleteProductFromCart(input: $input) {
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
            cartProductId: updatedProductInCart.id,
          },
        },
      },
    );
    expect(deleteProductFromCartPayload.data.deleteProductFromCart.success).toBeTruthy();
    expect(deleteProductFromCartPayload.data.deleteProductFromCart.cart.products).toHaveLength(1);
  });
});
