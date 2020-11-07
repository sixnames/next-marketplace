import { gql } from '@apollo/client';

export const languageFragment = gql`
  fragment Language on Language {
    id
    name
    key
    isDefault
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
    key
    message {
      key
      value
    }
  }
`;

export const GET_MESSAGES_BY_KEYS_QUERY = gql`
  query GetMessagesByKeys($keys: [String!]!) {
    getMessagesByKeys(keys: $keys) {
      ...Message
    }
  }
  ${messageFragment}
`;

export const VALIDATION_MESSAGES_QUERY = gql`
  query GetValidationMessages {
    getValidationMessages {
      ...Message
    }
  }
  ${messageFragment}
`;
