import { gql } from '@apollo/client';

export const productSnippedFragment = gql`
  fragment ProductSnippet on Product {
    id
    itemId
    nameString
    slug
    mainImage
    cardPrices {
      min
      max
    }
  }
`;

export const catalogueRubricFragment = gql`
  fragment CatalogueRubricFragment on Rubric {
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
`;

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($catalogueFilter: [String!]!) {
    getCatalogueData(catalogueFilter: $catalogueFilter) {
      catalogueTitle
      rubric {
        ...CatalogueRubricFragment
      }
      products {
        totalDocs
        page
        totalPages
        docs {
          ...ProductSnippet
        }
      }
    }
  }
  ${catalogueRubricFragment}
  ${productSnippedFragment}
`;
