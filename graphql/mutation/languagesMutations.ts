import { gql } from '@apollo/client';

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
  mutation DeleteLanguage($_id: ObjectId!) {
    deleteLanguage(_id: $_id) {
      success
      message
    }
  }
`;
