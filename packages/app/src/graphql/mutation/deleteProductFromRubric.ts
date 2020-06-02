import { gql } from '@apollo/client';

export const DELETE_PRODUCT_FROM_RUBRIC_MUTATION = gql`
  mutation DeleteProductFromRubric($input: DeleteProductFromRubricInput!) {
    deleteProductFromRubric(input: $input) {
      success
      message
      rubric {
        id
        products {
          id
          itemId
          name
          price
          slug
          #          mainImage {
          #            alt
          #            title
          #            url
          #            width
          #          }
        }
      }
    }
  }
`;
