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

export const catalogueRubricFilterAttributeFragment = gql`
  fragment CatalogueRubricFilterAttribute on RubricFilterAttribute {
    id
    node {
      id
      nameString
      slug
    }
    clearSlug
    isSelected
    isDisabled
    options {
      id
      slug
      color
      counter
      color
      filterNameString
      optionSlug
      optionNextSlug
      isSelected
      isDisabled
    }
  }
`;

export const catalogueRubricFilterFragment = gql`
  fragment CatalogueRubricFilter on RubricCatalogueFilter {
    id
    isDisabled
    clearSlug
    attributes {
      ...CatalogueRubricFilterAttribute
    }
    selectedAttributes {
      ...CatalogueRubricFilterAttribute
    }
  }
  ${catalogueRubricFilterAttributeFragment}
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
    catalogueFilter {
      ...CatalogueRubricFilter
    }
  }
  ${catalogueRubricFilterFragment}
`;

export const catalogueDataFragment = gql`
  fragment CatalogueData on CatalogueData {
    catalogueTitle
    catalogueFilter
    minPrice
    maxPrice
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
