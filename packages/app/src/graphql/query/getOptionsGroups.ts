import gql from 'graphql-tag';

export const OPTIONS_GROUPS_QUERY = gql`
  query GetOptionsGroups {
    getAllOptionsGroups {
      id
      nameString
      options {
        id
      }
    }
  }
`;
