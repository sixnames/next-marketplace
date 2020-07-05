import gql from 'graphql-tag';

export const createOptionsGroup = gql`
  mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
    createOptionsGroup(input: $input) {
      success
      message
      group {
        id
        nameString
        options {
          id
        }
      }
    }
  }
`;
