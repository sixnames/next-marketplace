import gql from 'graphql-tag';

export const CREATE_ATTRIBUTES_GROUP = gql`
  mutation CreateAttributesGroup($input: CreateAttributesGroupInput!) {
    createAttributesGroup(input: $input) {
      success
      message
      group {
        id
        nameString
      }
    }
  }
`;
