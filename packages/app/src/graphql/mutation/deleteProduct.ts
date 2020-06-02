import { gql } from '@apollo/client';

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
      success
      message
    }
  }
`;
