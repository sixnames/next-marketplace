import { gql } from '@apollo/client';

export const CREATE_RUBRIC_VARIANT_MUTATION = gql`
  mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
    createRubricVariant(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_RUBRIC_VARIANT_MUTATION = gql`
  mutation UpdateRubricVariant($input: UpdateRubricVariantInput!) {
    updateRubricVariant(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_RUBRIC_VARIANT_MUTATION = gql`
  mutation DeleteRubricVariant($_id: ObjectId!) {
    deleteRubricVariant(_id: $_id) {
      success
      message
    }
  }
`;
