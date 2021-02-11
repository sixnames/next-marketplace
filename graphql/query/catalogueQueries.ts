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
    slug
    mainImage
    shopsCount
    listFeatures {
      _id
      attributeId
      attributeName
      readableValue
    }
    ratingFeatures {
      _id
      attributeId
      attributeName
      readableValue
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
    counter
    slug
    nextSlug
    isSelected
    isDisabled
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

export const catalogueSelectedPricesFragment = gql`
  fragment CatalogueSelectedPrices on CatalogueFilterSelectedPrices {
    clearSlug
    formattedMinPrice
    formattedMaxPrice
  }
`;

export const catalogueFilterFragment = gql`
  fragment CatalogueFilter on CatalogueFilter {
    _id
    clearSlug
    selectedPrices {
      ...CatalogueSelectedPrices
    }
    attributes {
      ...CatalogueFilterAttribute
    }
    selectedAttributes {
      ...CatalogueFilterAttribute
    }
  }
  ${catalogueSelectedPricesFragment}
  ${catalogueFilterAttributeFragment}
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
    catalogueTitle
    catalogueFilter {
      ...CatalogueFilter
    }
    rubric {
      ...CatalogueRubric
    }
    products {
      totalDocs
      page
      totalPages
      sortBy
      sortDir
      minPrice
      maxPrice
      docs {
        ...ProductSnippet
      }
    }
  }
  ${catalogueFilterFragment}
  ${catalogueRubricFragment}
  ${productSnippedFragment}
`;

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($catalogueFilter: [String!]!, $productsInput: ProductsPaginationInput!) {
    getCatalogueData(catalogueFilter: $catalogueFilter, productsInput: $productsInput) {
      ...CatalogueData
    }
  }
  ${catalogueDataFragment}
`;
