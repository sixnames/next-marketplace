import gql from 'graphql-tag';

export const OPTIONS_GROUPS_QUERY = gql`
  query GetAllOptionsGroups {
    getAllOptionsGroups {
      id
      nameString
      options {
        id
      }
    }
  }
`;
