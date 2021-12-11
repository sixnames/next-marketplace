import { gql } from '@apollo/client';

export const CREATE_ATTRIBUTES_GROUP = gql`
  mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
    createAttributesGroup(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_ATTRIBUTES_GROUP_MUTATION = gql`
  mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
    updateAttributesGroup(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_ATTRIBUTES_GROUP_MUTATION = gql`
  mutation DeleteAttributesGroup($_id: ObjectId!) {
    deleteAttributesGroup(_id: $_id) {
      success
      message
    }
  }
`;

export const ADD_ATTRIBUTES_GROUP_TO_RUBRIC = gql`
  mutation AddAttributesGroupToRubric($input: AddAttributesGroupToRubricInput!) {
    addAttributesGroupToRubric(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_ATTRIBUTES_GROUP_FROM_RUBRIC = gql`
  mutation DeleteAttributesGroupFromRubric($input: DeleteAttributesGroupFromRubricInput!) {
    deleteAttributesGroupFromRubric(input: $input) {
      success
      message
    }
  }
`;

export const ADD_ATTRIBUTES_GROUP_TO_CATEGORY = gql`
  mutation AddAttributesGroupToCategory($input: AddAttributesGroupToCategoryInput!) {
    addAttributesGroupToCategory(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_ATTRIBUTES_GROUP_FROM_CATEGORY = gql`
  mutation DeleteAttributesGroupFromCategory($input: DeleteAttributesGroupFromCategoryInput!) {
    deleteAttributesGroupFromCategory(input: $input) {
      success
      message
    }
  }
`;
