import gql from 'graphql-tag';

export const UPDATE_OPTION_MUTATION = gql`
  mutation UpdateOptionInGroup($input: UpdateOptionInGroupInput!) {
    updateOptionInGroup(input: $input) {
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
