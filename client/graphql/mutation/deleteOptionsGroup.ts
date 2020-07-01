import gql from 'graphql-tag';

export const DELETE_OPTIONS_GROUP_MUTATION = gql`
  mutation DeleteOptionsGroup($id: ID!) {
    deleteOptionsGroup(id: $id) {
      success
      message
    }
  }
`;
