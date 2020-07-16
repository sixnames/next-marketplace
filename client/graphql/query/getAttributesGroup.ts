import gql from 'graphql-tag';

export const ATTRIBUTES_GROUP_QUERY = gql`
  query GetAttributesGroup($id: ID!) {
    getAttributesGroup(id: $id) {
      id
      nameString
      attributes {
        id
        name {
          key
          value
        }
        nameString
        variant
        positioningInTitle {
          key
          value
        }
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
