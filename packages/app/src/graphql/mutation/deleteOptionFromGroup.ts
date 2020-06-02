import { gql } from '@apollo/client';

export const DELETE_OPTION_FROM_GROUP_MUTATION = gql`
  mutation DeleteOptionFromGroup($input: DeleteOptionFromGroupInput!) {
    deleteOptionFromGroup(input: $input) {
      success
      message
      group {
        id
        name
        options {
          id
          name
          color
        }
      }
    }
  }
`;
