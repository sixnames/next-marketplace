import { gql } from '@apollo/client';

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
