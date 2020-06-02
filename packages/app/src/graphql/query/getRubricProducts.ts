import { gql } from '@apollo/client';

export const RUBRIC_PRODUCTS_QUERY = gql`
  query GetRubricProducts($id: ID!, $notInRubric: ID) #    $imageWidth: Int!
  {
    getRubric(id: $id) {
      id
      products(notInRubric: $notInRubric) {
        id
        itemId
        name
        price
        slug
        #        mainImage(width: $imageWidth) {
        #          alt
        #          title
        #          url
        #          width
        #        }
      }
    }
  }
`;
