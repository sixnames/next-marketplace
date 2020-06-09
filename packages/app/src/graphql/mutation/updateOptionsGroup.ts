import gql from 'graphql-tag';

export const UPDATE_OPTIONS_GROUP_MUTATION = gql`
  mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
    updateOptionsGroup(input: $input) {
      success
      message
      group {
        id
        nameString
        options {
          id
          nameString
          color
        }
      }
    }
  }
`;
