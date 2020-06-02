import { gql } from '@apollo/client';

export const DELETE_OPTIONS_GROUP_MUTATION = gql`
  mutation DeleteOptionsGroup($input: DeleteOptionsGroupInput!) {
    deleteOptionsGroup(input: $input) {
      success
      message
    }
  }
`;
