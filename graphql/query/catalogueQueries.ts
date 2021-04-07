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
    shopsCount
    isCustomersChoice
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
    cardPrices {
      _id
      min
      max
    }
  }
  ${SnippetConnectionFragment}
`;

export const UPDATE_CATALOGUE_COUNTERS_MUTATION = gql`
  mutation UpdateCatalogueCounters($input: CatalogueDataInput!) {
    updateCatalogueCounters(input: $input)
  }
`;
