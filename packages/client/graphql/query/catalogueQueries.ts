import { gql } from '@apollo/client';

export const productSnippedFragment = gql`
  fragment ProductSnippet on Product {
    id
    itemId
    nameString
    slug
    mainImage
    cardFeatures {
      listFeaturesString
      ratingFeaturesValues
    }
    cardPrices {
      min
      max
    }
  }
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

export const CATALOGUE_RUBRIC_QUERY = gql`
  query GetCatalogueRubric($catalogueFilter: [String!]!) {
    getCatalogueData(catalogueFilter: $catalogueFilter) {
      catalogueTitle
      rubric {
        ...CatalogueRubric
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
