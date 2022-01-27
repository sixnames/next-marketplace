import { gql } from '@apollo/client';

export const CREATE_PRODUCT_CONNECTION_MUTATION = gql`
  mutation CreateProductConnection($input: CreateProductConnectionInput!) {
    createProductConnection(input: $input) {
      success
      message
    }
  }
`;

export const ADD_PRODUCT_TO_CONNECTION_MUTATION = gql`
  mutation AddProductToConnection($input: AddProductToConnectionInput!) {
    addProductToConnection(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_FROM_CONNECTION_MUTATION = gql`
  mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
    deleteProductFromConnection(input: $input) {
      success
      message
    }
  }
`;
