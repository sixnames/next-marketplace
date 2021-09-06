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
