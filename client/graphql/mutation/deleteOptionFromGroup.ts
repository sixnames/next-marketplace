import gql from 'graphql-tag';

export const DELETE_OPTION_FROM_GROUP_MUTATION = gql`
  mutation DeleteOptionFromGroup($input: DeleteOptionFromGroupInput!) {
    deleteOptionFromGroup(input: $input) {
      success
      message
    }
  }
`;
