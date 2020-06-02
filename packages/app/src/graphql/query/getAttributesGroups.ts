import { gql } from '@apollo/client';

export const ATTRIBUTES_GROUPS_QUERY = gql`
  query GetAttributesGroups {
    getAllAttributesGroups {
      id
      name
    }
  }
`;
