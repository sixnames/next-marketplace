import gql from 'graphql-tag';

export const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts($input: ProductPaginateInput!) {
    getAllProducts(input: $input) {
      totalDocs
      page
      totalPages
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
