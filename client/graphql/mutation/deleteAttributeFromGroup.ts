import gql from 'graphql-tag';

export const DELETE_ATTRIBUTE_FROM_GROUP_MUTATION = gql`
  mutation DeleteAttributeFromGroup($input: DeleteAttributeFromGroupInput!) {
    deleteAttributeFromGroup(input: $input) {
      success
      message
    }
  }
`;
