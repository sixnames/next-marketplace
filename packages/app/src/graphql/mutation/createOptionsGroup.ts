import { gql } from '@apollo/client';

export const createOptionsGroup = gql`
  mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
    createOptionsGroup(input: $input) {
      success
      message
      group {
        id
        name
        options {
          id
        }
      }
    }
  }
`;
