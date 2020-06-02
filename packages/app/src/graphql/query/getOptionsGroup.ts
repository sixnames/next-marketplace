import { gql } from '@apollo/client';

export const OPTIONS_GROUP_QUERY = gql`
  query GetOptionsGroup($id: ID!) {
    getOptionsGroup(id: $id) {
      id
      name
      options {
        id
        name
        color
      }
    }
  }
`;
