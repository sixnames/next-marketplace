import { gql } from '@apollo/client';

export const rubricInCountersTreeFragment = gql`
  fragment RubricInTreeCounters on RubricCounters {
    _id
    totalActiveDocs
    totalDocs
  }
`;

export const rubricInTreeFragment = gql`
  fragment RubricInTree on Rubric {
    _id
    nameI18n
    name
    level
    variant {
      _id
      name
    }
  }
`;

export const rubricProductFragment = gql`
  fragment RubricProduct on Product {
    _id
    itemId
    nameI18n
    name
    slug
    mainImage
    active
    rubricsIds
  }
`;

export const rubricProductsFragment = gql`
  fragment RubricProductsPagination on ProductsPaginationPayload {
    totalDocs
    page
    totalPages
    totalActiveDocs
    docs {
      ...RubricProduct
    }
  }
  ${rubricProductFragment}
`;

export const RUBRICS_TREE_QUERY = gql`
  query GetRubricsTree($input: GetRubricsTreeInput, $countersInput: RubricProductsCountersInput) {
    getRubricsTree(input: $input) {
      ...RubricInTree
      productsCounters(input: $countersInput) {
        ...RubricInTreeCounters
      }
      children(input: $input) {
        ...RubricInTree
        productsCounters(input: $countersInput) {
          ...RubricInTreeCounters
        }
        children(input: $input) {
          ...RubricInTree
          productsCounters(input: $countersInput) {
            ...RubricInTreeCounters
          }
        }
      }
    }
  }
  ${rubricInCountersTreeFragment}
  ${rubricInTreeFragment}
`;

export const RUBRIC_QUERY = gql`
  query GetRubric($_id: ObjectId!) {
    getRubric(_id: $_id) {
      ...RubricInTree
      productsCounters {
        ...RubricInTreeCounters
      }
      active
      variantId
      descriptionI18n
      shortDescriptionI18n
      catalogueTitle {
        defaultTitleI18n
        prefixI18n
        keywordI18n
        gender
      }
    }
  }

  ${rubricInCountersTreeFragment}
  ${rubricInTreeFragment}
`;

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
    }
  }

  ${rubricInTreeFragment}
`;

export const UPDATE_RUBRIC = gql`
  mutation UpdateRubric($input: UpdateRubricInput!) {
    updateRubric(input: $input) {
      success
      message
    }
  }

  ${rubricInTreeFragment}
`;

export const DELETE_RUBRIC = gql`
  mutation DeleteRubric($_id: ObjectId!) {
    deleteRubric(_id: $_id) {
      success
      message
    }
  }
`;

export const RUBRIC_PRODUCTS_QUERY = gql`
  query GetRubricProducts(
    $rubricId: ObjectId!
    $excludedRubricsIds: [ObjectId!]
    $excludedProductsIds: [ObjectId!]
    $attributesIds: [ObjectId!]
  ) {
    getRubric(_id: $rubricId) {
      _id
      products(
        input: {
          excludedRubricsIds: $excludedRubricsIds
          excludedProductsIds: $excludedProductsIds
          attributesIds: $attributesIds
        }
      ) {
        ...RubricProductsPagination
      }
    }
  }

  ${rubricProductsFragment}
`;

export const GET_NON_RUBRIC_PRODUCTS_QUERY = gql`
  query GetNonRubricProducts($input: ProductsPaginationInput!) {
    getProductsList(input: $input) {
      ...RubricProductsPagination
    }
  }

  ${rubricProductsFragment}
`;

export const ADD_PRODUCT_TO_RUBRIC_MUTATION = gql`
  mutation AddProductTuRubric($input: AddProductToRubricInput!) {
    addProductToRubric(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_FROM_RUBRIC_MUTATION = gql`
  mutation DeleteProductFromRubric($input: DeleteProductFromRubricInput!) {
    deleteProductFromRubric(input: $input) {
      success
      message
    }
  }
`;

export const GET_ALL_PRODUCTS_QUERY = gql`
  query GetAllProducts($input: ProductsPaginationInput!) {
    getProductsList(input: $input) {
      ...RubricProductsPagination
    }
  }

  ${rubricProductsFragment}
`;

export const rubricAttributeFragment = gql`
  fragment RubricAttribute on Attribute {
    _id
    name
    variant
    metric {
      _id
      name
    }
    optionsGroup {
      _id
      name
    }
  }
`;

export const rubricAttributesGroupFragment = gql`
  fragment RubricAttributesGroup on RubricAttributesGroup {
    _id
    isOwner
    showInCatalogueFilter
    attributesGroup {
      _id
      name
      attributes {
        ...RubricAttribute
      }
    }
  }
  ${rubricAttributeFragment}
`;

export const RUBRIC_ATTRIBUTES_QUERY = gql`
  query GetRubricAttributes($rubricId: ObjectId!) {
    getRubric(_id: $rubricId) {
      _id
      level
      attributesGroups {
        ...RubricAttributesGroup
      }
    }
  }
  ${rubricAttributesGroupFragment}
`;
