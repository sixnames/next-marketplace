import { gql } from '@apollo/client';

export const DELETE_ATTRIBUTES_GROUP_MUTATION = gql`
  mutation DeleteAttributesGroup($input: DeleteAttributesGroupInput!) {
    deleteAttributesGroup(input: $input) {
      success
      message
    }
  }
`;
