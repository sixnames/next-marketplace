import gql from 'graphql-tag';

export const CREATE_OPTIONS_GROUP_MUTATION = gql`
  mutation CreateOptionsGroup($input: CreateOptionsGroupInput!) {
    createOptionsGroup(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_OPTIONS_GROUP_MUTATION = gql`
  mutation UpdateOptionsGroup($input: UpdateOptionsGroupInput!) {
    updateOptionsGroup(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_OPTIONS_GROUP_MUTATION = gql`
  mutation DeleteOptionsGroup($id: ID!) {
    deleteOptionsGroup(id: $id) {
      success
      message
    }
  }
`;

export const ADD_OPTION_TO_GROUP_MUTATION = gql`
  mutation AddOptionToGroup($input: AddOptionToGroupInput!) {
    addOptionToGroup(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_OPTION_IN_GROUP_MUTATION = gql`
  mutation UpdateOptionInGroup($input: UpdateOptionInGroupInput!) {
    updateOptionInGroup(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_OPTION_FROM_GROUP_MUTATION = gql`
  mutation DeleteOptionFromGroup($input: DeleteOptionFromGroupInput!) {
    deleteOptionFromGroup(input: $input) {
      success
      message
    }
  }
`;
