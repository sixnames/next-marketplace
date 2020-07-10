import gql from 'graphql-tag';

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($slug: String!, $productsInput: RubricProductPaginateInput) {
    getRubricBySlug(slug: $slug) {
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
                color
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
