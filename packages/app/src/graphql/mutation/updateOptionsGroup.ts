import { gql } from '@apollo/client';

export const UPDATE_OPTIONS_GROUP_MUTATION = gql`
  mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
    updateOptionsGroup(input: $input) {
      success
      message
      group {
        id
        name
      }
    }
  }
`;
