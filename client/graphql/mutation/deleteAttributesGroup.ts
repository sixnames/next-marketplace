import gql from 'graphql-tag';

export const DELETE_ATTRIBUTES_GROUP_MUTATION = gql`
  mutation DeleteAttributesGroup($id: ID!) {
    deleteAttributesGroup(id: $id) {
      success
      message
    }
  }
`;
