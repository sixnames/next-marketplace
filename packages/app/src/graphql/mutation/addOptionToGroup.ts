import { gql } from '@apollo/client';

export const ADD_OPTION_MUTATION = gql`
  mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
    addOptionToGroup(input: $input) {
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
