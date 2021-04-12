import { gql } from '@apollo/client';

export const SnippetConnectionItemFragment = gql`
  fragment SnippetConnectionItem on ProductConnectionItem {
    _id
    productId
    option {
      _id
      name
    }
  }
`;

export const SnippetConnectionFragment = gql`
  fragment SnippetConnection on ProductConnection {
    _id
    attributeName
    connectionProducts {
      ...SnippetConnectionItem
    }
  }
  ${SnippetConnectionItemFragment}
`;

export const productSnippedFragment = gql`
  fragment ProductSnippet on Product {
    _id
    itemId
    name
    originalName
    slug
    mainImage
    listFeatures {
      _id
      attributeId
      attributeName
      readableValue
      attributeMetric {
        _id
        name
      }
    }
    shopsCount
    cardPrices {
      _id
      min
      max
    }
    ratingFeatures {
      _id
      attributeId
      attributeName
      readableValue
      attributeMetric {
        _id
        name
      }
    }
    connections {
      ...SnippetConnection
    }
  }
  ${SnippetConnectionFragment}
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
