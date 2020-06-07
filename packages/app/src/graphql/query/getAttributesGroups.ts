import gql from 'graphql-tag';

export const ATTRIBUTES_GROUPS_QUERY = gql`
  query GetAttributesGroups {
    getAllAttributesGroups {
      id
      nameString
    }
  }
`;
