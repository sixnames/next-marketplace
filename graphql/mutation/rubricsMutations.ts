import { gql } from '@apollo/client';

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_RUBRIC = gql`
  mutation UpdateRubric($input: UpdateRubricInput!) {
    updateRubric(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_RUBRIC = gql`
  mutation DeleteRubric($_id: ObjectId!) {
    deleteRubric(_id: $_id) {
      success
      message
    }
  }
`;

export const UPDATE_RUBRIC_ATTRIBUTE_MUTATION = gql`
  mutation UpdateAttributeInRubric($input: UpdateAttributeInRubricInput!) {
    updateAttributeInRubric(input: $input) {
      success
      message
    }
  }
`;
