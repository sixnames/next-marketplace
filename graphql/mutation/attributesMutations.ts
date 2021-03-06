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

export const TOGGLE_CMS_CARD_ATTRIBUTE_IN_CATEGORY = gql`
  mutation ToggleCmsCardAttributeInCategory($input: UpdateAttributeInCategoryInput!) {
    toggleCmsCardAttributeInCategory(input: $input) {
      success
      message
    }
  }
`;
