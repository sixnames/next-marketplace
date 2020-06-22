import gql from 'graphql-tag';

export const GET_NON_RUBRIC_PRODUCTS_QUERY = gql`
  query GetNonRubricProducts($input: ProductPaginateInput!) {
    getAllProducts(input: $input) {
      totalDocs
      page
      totalPages
      activeProductsCount
      docs {
        id
        itemId
        name
        price
        slug
        mainImage
      }
    }
  }
`;
