import { gql } from '@apollo/client';
import { cartFragment } from '../query/initialQueries';

export const ADD_PRODUCT_TO_CART_MUTATION = gql`
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
`;

export const DELETE_PRODUCT_FROM_CART_MUTATION = gql`
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
`;

export const UPDATE_PRODUCT_IN_CART_MUTATION = gql`
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
`;
