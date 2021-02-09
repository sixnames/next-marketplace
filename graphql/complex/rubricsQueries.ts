import { gql } from '@apollo/client';

export const rubricInListFragment = gql`
  fragment RubricInList on Rubric {
    _id
    nameI18n
    name
    productsCount
    activeProductsCount
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

export const ALL_RUBRICS_QUERY = gql`
  query GetAllRubrics($input: GetAllRubricsInput) {
    getAllRubrics(input: $input) {
      ...RubricInList
    }
  }
  ${rubricInListFragment}
`;

export const RUBRIC_QUERY = gql`
  query GetRubric($_id: ObjectId!) {
    getRubric(_id: $_id) {
      ...RubricInList
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
  ${rubricInListFragment}
`;

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
    }
  }

  ${rubricInListFragment}
`;

export const UPDATE_RUBRIC = gql`
  mutation UpdateRubric($input: UpdateRubricInput!) {
    updateRubric(input: $input) {
      success
      message
    }
  }

  ${rubricInListFragment}
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
  fragment RubricAttribute on RubricAttribute {
    _id
    name
    variant
    metric {
      _id
      name
    }
    optionsGroupId
    showInCatalogueFilter
    showInCatalogueNav
  }
`;

export const rubricAttributesGroupFragment = gql`
  fragment RubricAttributesGroup on RubricAttributesGroup {
    _id
    name
    attributes {
      ...RubricAttribute
    }
  }
  ${rubricAttributeFragment}
`;

export const RUBRIC_ATTRIBUTES_QUERY = gql`
  query GetRubricAttributes($rubricId: ObjectId!) {
    getRubric(_id: $rubricId) {
      _id
      attributesGroups {
        ...RubricAttributesGroup
      }
    }
  }
  ${rubricAttributesGroupFragment}
`;
