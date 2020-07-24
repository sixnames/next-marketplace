import gql from 'graphql-tag';

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
  mutation DeleteRubricVariant($id: ID!) {
    deleteRubricVariant(id: $id) {
      success
      message
    }
  }
`;
