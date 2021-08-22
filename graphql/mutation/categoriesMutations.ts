import { gql } from '@apollo/client';

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($input: UpdateCategoryInput!) {
    updateCategory(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($_id: ObjectId!) {
    deleteCategory(_id: $_id) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_FROM_CATEGORY_MUTATION = gql`
  mutation DeleteProductFromCategory($input: DeleteProductFromCategoryInput!) {
    deleteProductFromCategory(input: $input) {
      success
      message
    }
  }
`;

export const TOGGLE_ATTRIBUTE_IN_CATEGORY_CATALOGUE = gql`
  mutation ToggleAttributeInCategoryCatalogue($input: UpdateAttributeInCategoryInput!) {
    toggleAttributeInCategoryCatalogue(input: $input) {
      success
      message
    }
  }
`;

export const TOGGLE_ATTRIBUTE_IN_CATEGORY_NAV = gql`
  mutation ToggleAttributeInCategoryNav($input: UpdateAttributeInCategoryInput!) {
    toggleAttributeInCategoryNav(input: $input) {
      success
      message
    }
  }
`;

export const TOGGLE_ATTRIBUTE_IN_CATEGORY_PRODUCT_ATTRIBUTES = gql`
  mutation ToggleAttributeInCategoryProductAttributes($input: UpdateAttributeInCategoryInput!) {
    toggleAttributeInCategoryProductAttributes(input: $input) {
      success
      message
    }
  }
`;
