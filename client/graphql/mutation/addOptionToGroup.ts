import gql from 'graphql-tag';

export const ADD_OPTION_MUTATION = gql`
  mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
    addOptionToGroup(input: $input) {
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
