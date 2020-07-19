import gql from 'graphql-tag';

export const CREATE_LANGUAGE_MUTATION = gql`
  mutation CreateLanguage($input: CreateLanguageInput!) {
    createLanguage(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_LANGUAGE_MUTATION = gql`
  mutation UpdateLanguage($input: UpdateLanguageInput!) {
    updateLanguage(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_LANGUAGE_MUTATION = gql`
  mutation DeleteLanguage($id: ID!) {
    deleteLanguage(id: $id) {
      success
      message
    }
  }
`;

export const SET_LANGUAGE_AS_DEFAULT_MUTATION = gql`
  mutation SetLanguageAsDefault($id: ID!) {
    setLanguageAsDefault(id: $id) {
      success
      message
    }
  }
`;
