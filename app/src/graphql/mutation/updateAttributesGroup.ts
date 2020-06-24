import gql from 'graphql-tag';

export const UPDATE_ATTRIBUTES_GROUP_MUTATION = gql`
  mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
    updateAttributesGroup(input: $input) {
      success
      message
      group {
        id
        nameString
      }
    }
  }
`;
