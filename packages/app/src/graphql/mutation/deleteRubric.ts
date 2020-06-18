import gql from 'graphql-tag';

export const DELETE_RUBRIC = gql`
  mutation DeleteRubric($id: ID!) {
    deleteRubric(id: $id) {
      success
      message
    }
  }
`;
