import gql from 'graphql-tag';

export const ADD_PRODUCT_TO_RUBRIC_MUTATION = gql`
  mutation AddProductTuRubric($input: AddProductToRubricInput!) {
    addProductToRubric(input: $input) {
      success
      message
      rubric {
        id
        activeProductsCount
        totalProductsCount
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