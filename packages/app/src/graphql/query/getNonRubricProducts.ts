import { gql } from '@apollo/client';

export const GET_NON_RUBRIC_PRODUCTS_QUERY = gql`
  query GetNonRubricProducts(
    $noRubrics: Boolean
    $page: Int!
    $limit: Int
    $query: String
    $notInRubric: ID
  ) {
    getAllProducts(
      noRubrics: $noRubrics
      page: $page
      limit: $limit
      query: $query
      notInRubric: $notInRubric
    ) {
      totalDocs
      page
      totalPages
      docs {
        id
        itemId
        name
        price
        slug
        #        mainImage {
        #          alt
        #          title
        #          url
        #          width
        #        }
      }
    }
  }
`;
