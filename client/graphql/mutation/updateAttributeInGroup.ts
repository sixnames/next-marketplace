import gql from 'graphql-tag';

export const UPDATE_ATTRIBUTE_MUTATION = gql`
  mutation UpdateAttributeInGroup($input: UpdateAttributeInGroupInput!) {
    updateAttributeInGroup(input: $input) {
      success
      message
    }
  }
`;
