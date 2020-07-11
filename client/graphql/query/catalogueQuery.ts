import gql from 'graphql-tag';

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($slug: String!, $productsInput: RubricProductPaginateInput) {
    getRubricBySlug(slug: $slug) {
      id
      name
      level
      slug
      catalogueName
      variant {
        id
        nameString
      }
      activeProductsCount
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
            slug
            options {
              id
              nameString
              options {
                id
                slug
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
