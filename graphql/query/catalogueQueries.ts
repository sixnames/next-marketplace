import { gql } from '@apollo/client';
import { cardConnectionFragment } from './cardQueries';

export const productSnippedFragment = gql`
  fragment ProductSnippet on Product {
    _id
    itemId
    name
    slug
    mainImage
    shopsCount
    cardConnections {
      ...CardConnection
    }
    snippetFeatures {
      listFeaturesString
      ratingFeaturesValues
    }
    cardFeatures {
      _id
      listFeatures {
        text
        number
        selectedOptions {
          _id
          name
          icon
        }
        attribute {
          _id
          name
        }
      }
    }
    cardPrices {
      min
      max
    }
  }
  ${cardConnectionFragment}
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
    _id
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
    level
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
