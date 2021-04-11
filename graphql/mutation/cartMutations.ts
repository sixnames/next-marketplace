import { gql } from '@apollo/client';

export const orderInCartFragment = gql`
  fragment OrderInCart on Order {
    _id
    itemId
  }
`;

export const cartPayloadFragment = gql`
  fragment CartPayload on CartPayload {
    success
    message
  }
`;

export const makeAnOrderPayloadFragment = gql`
  fragment MakeAnOrderPayload on MakeAnOrderPayload {
    success
    message
    order {
      ...OrderInCart
    }
  }
  ${orderInCartFragment}
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

export const MAKE_AN_ORDER_MUTATION = gql`
  mutation MakeAnOrder($input: MakeAnOrderInput!) {
    makeAnOrder(input: $input) {
      ...MakeAnOrderPayload
    }
  }
  ${makeAnOrderPayloadFragment}
`;

export const REPEAT_AN_ORDER_MUTATION = gql`
  mutation RepeatAnOrder($input: RepeatOrderInput!) {
    repeatOrder(input: $input) {
      ...CartPayload
    }
  }
  ${cartPayloadFragment}
`;
