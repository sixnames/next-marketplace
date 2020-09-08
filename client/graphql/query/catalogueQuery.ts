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
          node {
            id
            nameString
            slug
          }
          options {
            id
            slug
            filterNameString
            color
            counter
            color
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
