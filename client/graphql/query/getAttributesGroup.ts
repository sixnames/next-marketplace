import gql from 'graphql-tag';

export const ATTRIBUTES_GROUP_QUERY = gql`
  query GetAttributesGroup($id: ID!) {
    getAttributesGroup(id: $id) {
      id
      nameString
      attributes {
        id
        nameString
        variant
        options {
          id
          nameString
        }
        metric {
          id
          nameString
        }
      }
    }
  }
`;
