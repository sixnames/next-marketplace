import { gql } from '@apollo/client';

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

export const OPTIONS_GROUP_QUERY = gql`
  query GetOptionsGroup($id: ID!) {
    getOptionsGroup(id: $id) {
      id
      name {
        key
        value
      }
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
