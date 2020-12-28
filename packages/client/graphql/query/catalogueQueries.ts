import { gql } from '@apollo/client';
import { cardConnectionFragment } from './cardQueries';

export const productSnippedFragment = gql`
  fragment ProductSnippet on Product {
    id
    itemId
    nameString
    slug
    mainImage
    shopsCount
    cardConnections {
      ...CardConnection
    }
    cardFeatures {
      id
      listFeatures {
        readableValue
        node {
          id
          nameString
        }
      }
      listFeaturesString
      ratingFeaturesValues
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
    id
    nameString
    counter
    slug
    nextSlug
    isSelected
    isDisabled
  }
`;

export const catalogueFilterAttributeFragment = gql`
  fragment CatalogueFilterAttribute on CatalogueFilterAttribute {
    id
    slug
    clearSlug
    isSelected
    nameString
    options {
      ...CatalogueFilterAttributeOption
    }
  }
  ${catalogueFilterAttributeOptionFragment}
`;

export const catalogueSelectedPricesFragment = gql`
  fragment CatalogueSelectedPrices on CatalogueFilterSelectedPrices {
    id
    clearSlug
    formattedMinPrice
    formattedMaxPrice
  }
`;

export const catalogueFilterFragment = gql`
  fragment CatalogueFilter on CatalogueFilter {
    id
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
    id
    nameString
    level
    slug
    variant {
      id
      nameString
    }
  }
`;

export const catalogueDataFragment = gql`
  fragment CatalogueData on CatalogueData {
    catalogueTitle
    minPrice
    maxPrice
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
  query GetCatalogueRubric($catalogueFilter: [String!]!, $productsInput: CatalogueProductsInput) {
    getCatalogueData(catalogueFilter: $catalogueFilter, productsInput: $productsInput) {
      ...CatalogueData
    }
  }
  ${catalogueDataFragment}
`;
