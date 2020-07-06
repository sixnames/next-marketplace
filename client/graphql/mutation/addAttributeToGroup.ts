import gql from 'graphql-tag';

export const ADD_ATTRIBUTE_MUTATION = gql`
  mutation AddAttributeToGroup($input: AddAttributeToGroupInput!) {
    addAttributeToGroup(input: $input) {
      success
      message
      group {
        id
        nameString
        attributes {
          id
          nameString
          variant
          options {
            id
            nameString
          }
          metric {
            id
            nameString
          }
        }
      }
    }
  }
`;
