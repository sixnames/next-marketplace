import gql from 'graphql-tag';

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      success
      message
    }
  }
`;
