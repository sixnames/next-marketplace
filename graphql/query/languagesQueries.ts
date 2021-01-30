import { gql } from '@apollo/client';

export const languageFragment = gql`
  fragment Language on Language {
    _id
    name
    slug
    nativeName
  }
`;

export const GET_ALL_LANGUAGES_QUERY = gql`
  query GetAllLanguages {
    getAllLanguages {
      ...Language
    }
  }
  ${languageFragment}
`;

export const messageFragment = gql`
  fragment Message on Message {
    _id
    slug
    messageI18n
    message
  }
`;

export const VALIDATION_MESSAGES_QUERY = gql`
  query GetValidationMessages {
    getValidationMessages {
      ...Message
    }
  }
  ${messageFragment}
`;
