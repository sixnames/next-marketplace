import gql from 'graphql-tag';

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
  mutation DeleteAttributesGroup($id: ID!) {
    deleteAttributesGroup(id: $id) {
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

export const UPDATE_ATTRIBUTE_IN_GROUP_MUTATION = gql`
  mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
    updateAttributeInGroup(input: $input) {
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

export const UPDATE_ATTRIBUTES_GROUP_IN_RUBRIC = gql`
  mutation UpdateAttributesGroupInRubric($input: UpdateAttributesGroupInRubricInput!) {
    updateAttributesGroupInRubric(input: $input) {
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
