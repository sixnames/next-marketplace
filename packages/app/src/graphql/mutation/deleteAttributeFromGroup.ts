import { gql } from '@apollo/client';

export const DELETE_ATTRIBUTE_FROM_GROUP_MUTATION = gql`
  mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
    deleteAttributeFromGroup(input: $input) {
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
