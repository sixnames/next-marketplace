import { gql } from '@apollo/client';

export const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts(
    $page: Int
    $limit: Int
    $sortDir: SortDirection
    $sortBy: SortableProductField
    $query: String
    $rubric: ID
    $notInRubric: ID
    $contractor: ID
    $notInContractor: ID
    $noRubrics: Boolean
  ) {
    getAllProducts(
      limit: $limit
      page: $page
      sortDir: $sortDir
      sortBy: $sortBy
      query: $query
      rubric: $rubric
      notInRubric: $notInRubric
      contractor: $contractor
      notInContractor: $notInContractor
      noRubrics: $noRubrics
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
