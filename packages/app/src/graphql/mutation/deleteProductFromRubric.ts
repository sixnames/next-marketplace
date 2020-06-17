import gql from 'graphql-tag';

export const DELETE_PRODUCT_FROM_RUBRIC_MUTATION = gql`
  mutation DeleteProductFromRubric($input: DeleteProductFromRubricInput!) {
    deleteProductFromRubric(input: $input) {
      success
      message
      rubric {
        id
        products {
          totalDocs
          page
          totalPages
          docs {
            id
            itemId
            name
            price
            slug
          }
        }
      }
    }
  }
`;
