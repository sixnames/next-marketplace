import { gql } from '@apollo/client';

export const UPDATE_ATTRIBUTE_MUTATION = gql`
  mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
    updateAttributeInGroup(input: $input) {
      success
      message
      group {
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
  }
`;
