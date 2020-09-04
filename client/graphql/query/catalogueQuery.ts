import { gql } from '@apollo/client';

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($catalogueFilter: [String!]!) {
    getCatalogueData(catalogueFilter: $catalogueFilter) {
      catalogueTitle
      rubric {
        id
        nameString
        level
        slug
        variant {
          id
          nameString
        }
        filterAttributes {
          id
          nameString
          variant
          slug
          filterOptions(filter: $catalogueFilter) {
            option {
              id
              slug
              nameString
              color
            }
            counter
          }
        }
      }
      products {
        totalDocs
        page
        totalPages
        docs {
          id
          itemId
          nameString
          price
          slug
          mainImage
        }
      }
    }
  }
`;
