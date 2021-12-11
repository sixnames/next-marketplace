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

export const ADD_ATTRIBUTE_TO_GROUP_MUTATION = gql`
  mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
    addAttributeToGroup(input: $input) {
      success
      message
    }
  }
`;

export const MOVE_ATTRIBUTE_MUTATION = gql`
  mutation MoveAttribute($input: MoveAttributeInput!) {
    moveAttribute(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_ATTRIBUTE_FROM_GROUP_MUTATION = gql`
  mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
    deleteAttributeFromGroup(input: $input) {
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
