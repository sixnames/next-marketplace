import { gql } from '@apollo/client';

export const ATTRIBUTES_GROUP_QUERY = gql`
  query GetAttributesGroup($id: ID!) {
    getAttributesGroup(id: $id) {
      id
      name
      attributes {
        id
        name
        type
        options {
          id
          name
        }
        metric {
          id
          name
        }
      }
    }
  }
`;
