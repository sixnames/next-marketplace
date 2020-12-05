import createTestData, {
  CreateTestDataPayloadInterface,
} from '../../../utils/testUtils/createTestData';
import clearTestData from '../../../utils/testUtils/clearTestData';
import {
  authenticatedTestClient,
  testClientWithContext,
} from '../../../utils/testUtils/testHelpers';
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

  const productSnippetFragment = gql`
    fragment ProductSnippet on Product {
      id
      itemId
      cardPrices {
        min
        max
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
        isShopless
        shopProduct {
          ...ShopProductSnippet
        }
        product {
          ...ProductSnippet
        }
      }
    }
    ${productSnippetFragment}
    ${shopProductSnippetFragment}
  `;

  it('Should CRUD Cart', async () => {
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
            amount: 1,
          },
        },
      },
    );
    console.log(JSON.stringify(addProductToCartPayload, null, 2));
    const {
      data: { addProductToCart },
    } = addProductToCartPayload;
    expect(addProductToCart.success).toBeTruthy();
    expect(addProductToCart.cart.productsCount).toEqual(1);

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
    expect(addProductToCartPayloadB.data.addProductToCart.cart.productsCount).toEqual(1);
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
    expect(addProductToCartPayloadC.data.addProductToCart.cart.productsCount).toEqual(2);

    // Should update second product in cart
    const newProductAmount = 3;
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
            cartProductId: secondCartProduct.id,
            amount: newProductAmount,
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
    expect(updatedProductInCart.amount).toEqual(newProductAmount);
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
    expect(deleteProductFromCartPayload.data.deleteProductFromCart.cart.productsCount).toEqual(1);
  });

  it('Should return session Cart', async () => {
    const initialTestClient = await authenticatedTestClient();
    const getSessionCartPayload = await initialTestClient.query<any>(
      gql`
        query GetSessionCart {
          getSessionCart {
            ...Cart
          }
        }
        ${cartFragment}
      `,
    );
    const sessionCart = getSessionCartPayload.data.getSessionCart;
    expect(sessionCart).toBeDefined();

    const { mutate } = await authenticatedTestClient({
      cartId: sessionCart.id,
    });

    // Should add shopless product to cart
    const addProductToCartPayload = await mutate<any>(
      gql`
        mutation AddShoplessProductToCart($input: AddShoplessProductToCartInput!) {
          addShoplessProductToCart(input: $input) {
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
            productId: mockData.productA.id,
            amount: 1,
          },
        },
      },
    );
    const {
      data: { addShoplessProductToCart },
    } = addProductToCartPayload;
    const shoplessCartProductA = addShoplessProductToCart.cart.products[0];
    expect(addShoplessProductToCart.success).toBeTruthy();
    expect(shoplessCartProductA.isShopless).toBeTruthy();
    expect(addShoplessProductToCart.cart.productsCount).toEqual(1);

    // Should add shop to shopless cart product
    const addShopToCartProductPayload = await mutate<any>(
      gql`
        mutation AddShopToCartProduct($input: AddShopToCartProductInput!) {
          addShopToCartProduct(input: $input) {
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
            cartProductId: shoplessCartProductA.id,
            shopProductId: mockData.shopAProductA.id,
          },
        },
      },
    );

    const {
      data: { addShopToCartProduct },
    } = addShopToCartProductPayload;

    const cartProductA = addShopToCartProduct.cart.products[0];
    expect(addShopToCartProduct.success).toBeTruthy();
    expect(cartProductA.isShopless).toBeFalsy();
    expect(addShopToCartProduct.cart.productsCount).toEqual(1);

    // Should add shop to shopless cart product
    const clearCartPayload = await mutate<any>(
      gql`
        mutation AddShopToCartProduct {
          clearCart {
            success
            message
            cart {
              ...Cart
            }
          }
        }
        ${cartFragment}
      `,
    );
    expect(clearCartPayload.data.clearCart.success).toBeTruthy();
    expect(clearCartPayload.data.clearCart.cart.products).toHaveLength(0);
  });
});
