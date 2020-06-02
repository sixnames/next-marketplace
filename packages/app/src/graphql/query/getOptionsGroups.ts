import { gql } from '@apollo/client';

export const OPTIONS_GROUPS_QUERY = gql`
  query GetOptionsGroups {
    getAllOptionsGroups {
      id
      name
      options {
        id
      }
    }
  }
`;
