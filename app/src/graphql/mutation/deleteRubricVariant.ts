import gql from 'graphql-tag';

export const DELETE_RUBRIC_VARIANT = gql`
  mutation DeleteRubricVariant($id: ID!) {
    deleteRubricVariant(id: $id) {
      success
      message
    }
  }
`;
