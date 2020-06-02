import { gql } from '@apollo/client';

export const ADD_ATTRIBUTE_MUTATION = gql`
  mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
    addAttributeToGroup(input: $input) {
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
