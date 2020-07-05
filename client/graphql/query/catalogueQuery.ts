import gql from 'graphql-tag';

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($id: ID!, $productsInput: RubricProductPaginateInput) {
    getRubric(id: $id) {
      id
      name
      level
      slug
      variant {
        id
        nameString
      }
      activeProductsCount
      catalogueName
      attributesGroups {
        id
        showInCatalogueFilter
        node {
          id
          nameString
          attributes {
            id
            nameString
            variant
            itemId
            options {
              id
              nameString
              options {
                id
                nameString
              }
            }
          }
        }
      }
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
