import { gql } from '@apollo/client';

const rubricFragment = gql`
  fragment RubricFragment on Rubric {
    id
    name {
      key
      value
    }
    nameString
    level
    variant {
      id
      nameString
    }
    totalProductsCount
    activeProductsCount
  }
`;

export const rubricProductFragment = gql`
  fragment RubricProduct on Product {
    id
    itemId
    name {
      key
      value
    }
    nameString
    price
    slug
    mainImage
    active
    rubrics
  }
`;

export const rubricProductsFragment = gql`
  fragment RubricProductsPagination on PaginatedProductsResponse {
    totalDocs
    page
    totalPages
    activeProductsCount
    docs {
      ...RubricProduct
    }
  }
  ${rubricProductFragment}
`;

export const RUBRICS_TREE_QUERY = gql`
  query GetRubricsTree($excluded: [ID!], $counters: ProductsCountersInput!) {
    getRubricsTree(excluded: $excluded) {
      ...RubricFragment
      children(excluded: $excluded) {
        ...RubricFragment
        children(excluded: $excluded) {
          ...RubricFragment
        }
      }
    }
    getProductsCounters(input: $counters) {
      totalProductsCount
      activeProductsCount
    }
  }

  ${rubricFragment}
`;

export const RUBRIC_QUERY = gql`
  query GetRubric($id: ID!) {
    getRubric(id: $id) {
      ...RubricFragment
      catalogueTitle {
        defaultTitle {
          key
          value
        }
        prefix {
          key
          value
        }
        keyword {
          key
          value
        }
        gender
      }
    }
  }

  ${rubricFragment}
`;

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
    }
  }

  ${rubricFragment}
`;

export const UPDATE_RUBRIC = gql`
  mutation UpdateRubric($input: UpdateRubricInput!) {
    updateRubric(input: $input) {
      success
      message
    }
  }

  ${rubricFragment}
`;

export const DELETE_RUBRIC = gql`
  mutation DeleteRubric($id: ID!) {
    deleteRubric(id: $id) {
      success
      message
    }
  }
`;

export const RUBRIC_PRODUCTS_QUERY = gql`
  query GetRubricProducts($id: ID!, $notInRubric: ID) {
    getRubric(id: $id) {
      id
      products(input: { notInRubric: $notInRubric }) {
        ...RubricProductsPagination
      }
    }
  }

  ${rubricProductsFragment}
`;

export const GET_NON_RUBRIC_PRODUCTS_QUERY = gql`
  query GetNonRubricProducts($input: ProductPaginateInput!) {
    getAllProducts(input: $input) {
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
  query GetAllProducts($input: ProductPaginateInput!) {
    getAllProducts(input: $input) {
      ...RubricProductsPagination
    }
  }

  ${rubricProductsFragment}
`;

export const rubricAttributeFragment = gql`
  fragment RubricAttribute on Attribute {
    id
    nameString
    variant
    metric {
      id
      nameString
    }
    options {
      id
      nameString
    }
  }
`;

export const rubricAttributesGroupFragment = gql`
  fragment RubricAttributesGroup on RubricAttributesGroup {
    id
    isOwner
    showInCatalogueFilter
    node {
      id
      nameString
      attributes {
        ...RubricAttribute
      }
    }
  }
  ${rubricAttributeFragment}
`;

export const RUBRIC_ATTRIBUTES_QUERY = gql`
  query GetRubricAttributes($id: ID!) {
    getRubric(id: $id) {
      id
      level
      attributesGroups {
        ...RubricAttributesGroup
      }
    }
  }
  ${rubricAttributesGroupFragment}
`;
