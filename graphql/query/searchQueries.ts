import { gql } from '@apollo/client';

export const productSnippedFragment = gql`
  fragment ProductSnippet on Product {
    _id
    itemId
    originalName
    slug
    rubricSlug
    mainImage
    shopsCount
    snippetTitle
    cardPrices {
      _id
      min
      max
    }
  }
`;

export const searchRubricFragment = gql`
  fragment SearchRubric on Rubric {
    _id
    name
    slug
  }
`;

export const CATALOGUE_SEARCH_TOP_ITEMS_QUERY = gql`
  query GetCatalogueSearchTopItems($input: CatalogueSearchTopItemsInput!) {
    getCatalogueSearchTopItems(input: $input) {
      rubrics {
        ...SearchRubric
      }
      products {
        ...ProductSnippet
      }
    }
  }
  ${searchRubricFragment}
  ${productSnippedFragment}
`;

export const CATALOGUE_SEARCH_RESULT_QUERY = gql`
  query GetCatalogueSearchResult($input: CatalogueSearchInput!) {
    getCatalogueSearchResult(input: $input) {
      rubrics {
        ...SearchRubric
      }
      products {
        ...ProductSnippet
      }
    }
  }
  ${searchRubricFragment}
  ${productSnippedFragment}
`;
