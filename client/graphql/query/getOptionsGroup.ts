import gql from 'graphql-tag';

export const OPTIONS_GROUP_QUERY = gql`
  query GetOptionsGroup($id: ID!) {
    getOptionsGroup(id: $id) {
      id
      nameString
      options {
        id
        name {
          key
          value
        }
        nameString
        color
        gender
        variants {
          key
          value {
            key
            value
          }
        }
      }
    }
  }
`;
