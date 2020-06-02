import { gql } from '@apollo/client';

export const UPDATE_OPTION_MUTATION = gql`
  mutation UpdateOptionInGroup($input: UpdateOptionInGroupInput!) {
    updateOptionInGroup(input: $input) {
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
