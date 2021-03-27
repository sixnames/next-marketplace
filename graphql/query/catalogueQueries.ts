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

export const catalogueFilterAttributeOptionFragment = gql`
  fragment CatalogueFilterAttributeOption on CatalogueFilterAttributeOption {
    _id
    name
    slug
    nextSlug
    isSelected
  }
`;

export const catalogueFilterAttributeFragment = gql`
  fragment CatalogueFilterAttribute on CatalogueFilterAttribute {
    _id
    slug
    clearSlug
    isSelected
    name
    options {
      ...CatalogueFilterAttributeOption
    }
  }
  ${catalogueFilterAttributeOptionFragment}
`;

export const catalogueRubricFragment = gql`
  fragment CatalogueRubric on Rubric {
    _id
    name
    slug
    variant {
      _id
      name
    }
  }
`;

export const catalogueDataFragment = gql`
  fragment CatalogueData on CatalogueData {
    _id
    lastProductId
    hasMore
    clearSlug
    filter
    catalogueTitle
    rubric {
      ...CatalogueRubric
    }
    products {
      ...ProductSnippet
    }
    totalProducts
    catalogueTitle
    attributes {
      ...CatalogueFilterAttribute
    }
    selectedAttributes {
      ...CatalogueFilterAttribute
    }
  }
  ${catalogueFilterAttributeFragment}
  ${catalogueRubricFragment}
  ${productSnippedFragment}
`;

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($input: CatalogueDataInput!) {
    getCatalogueData(input: $input) {
      ...CatalogueData
    }
  }
  ${catalogueDataFragment}
`;

export const UPDATE_CATALOGUE_COUNTERS_MUTATION = gql`
  mutation UpdateCatalogueCounters($input: CatalogueDataInput!) {
    updateCatalogueCounters(input: $input)
  }
`;
