import gql from 'graphql-tag';

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($id: ID!, $productsInput: RubricProductPaginateInput) {
    getRubric(id: $id) {
      id
      name
      level
      variant {
        id
        nameString
      }
      activeProductsCount
      catalogueName
      products(input: $productsInput) {
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
  }
`;
