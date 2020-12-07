import { gql } from '@apollo/client';
import { productCardFragment, shopProductSnippetFragment } from '../query/cardQueries';

export const cartProductFragment = gql`
  fragment CartProduct on CartProduct {
    id
    amount
    isShopless
    product {
      ...ProductCard
    }
    shopProduct {
      ...ShopProductSnippet
      product {
        ...ProductCard
      }
    }
  }
  ${productCardFragment}
  ${shopProductSnippetFragment}
`;

export const cartFragment = gql`
  fragment Cart on Cart {
    id
    formattedTotalPrice
    productsCount
    isWithShopless
    products {
      ...CartProduct
    }
  }
  ${cartProductFragment}
`;

export const cartPayloadFragment = gql`
  fragment CartPayload on CartPayloadType {
    success
    message
    cart {
      ...Cart
    }
  }
  ${cartFragment}
`;

export const ADD_PRODUCT_TO_CART_MUTATION = gql`
  mutation AddProductToCart($input: AddProductToCartInput!) {
    addProductToCart(input: $input) {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;

export const ADD_SHOPLESS_PRODUCT_TO_CART_MUTATION = gql`
  mutation AddShoplessProductToCart($input: AddShoplessProductToCartInput!) {
    addShoplessProductToCart(input: $input) {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;

export const ADD_SHOP_CART_PRODUCT_MUTATION = gql`
  mutation AddShopToCartProduct($input: AddShopToCartProductInput!) {
    addShopToCartProduct(input: $input) {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;

export const UPDATE_PRODUCT_IN_CART_MUTATION = gql`
  mutation UpdateProductInCart($input: UpdateProductInCartInput!) {
    updateProductInCart(input: $input) {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;

export const DELETE_PRODUCT_FROM_CART_MUTATION = gql`
  mutation DeleteProductFromCart($input: DeleteProductFromCartInput!) {
    deleteProductFromCart(input: $input) {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;

export const CLEAR_CART_MUTATION = gql`
  mutation ClearCart {
    clearCart {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;
