import { gql } from '@apollo/client';

export const UPDATE_ATTRIBUTES_GROUP_MUTATION = gql`
  mutation UpdateAttributesGroup($input: UpdateAttributesGroupInput!) {
    updateAttributesGroup(input: $input) {
      success
      message
      group {
        id
        name
      }
    }
  }
`;
