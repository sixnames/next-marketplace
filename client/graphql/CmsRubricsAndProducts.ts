import gql from 'graphql-tag';

const rubricFragment = gql`
  fragment RubricFragment on Rubric {
    id
    name
    level
    variant {
      id
      nameString
    }
    totalProductsCount
    activeProductsCount
  }
`;

const rubricProductsFragment = gql`
  fragment RubricProductFragment on PaginatedProductsResponse {
    totalDocs
    page
    totalPages
    activeProductsCount
    docs {
      id
      itemId
      name
      price
      slug
      mainImage
      active
    }
  }
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
      catalogueName
      parent {
        id
        name
        parent {
          id
          name
        }
      }
      children {
        ...RubricFragment
        children {
          ...RubricFragment
        }
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
      rubric {
        ...RubricFragment
        children {
          ...RubricFragment
          children {
            ...RubricFragment
          }
        }
        parent {
          id
        }
      }
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
        ...RubricProductFragment
      }
    }
  }

  ${rubricProductsFragment}
`;

export const GET_NON_RUBRIC_PRODUCTS_QUERY = gql`
  query GetNonRubricProducts($input: ProductPaginateInput!) {
    getAllProducts(input: $input) {
      ...RubricProductFragment
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
      ...RubricProductFragment
    }
  }

  ${rubricProductsFragment}
`;
