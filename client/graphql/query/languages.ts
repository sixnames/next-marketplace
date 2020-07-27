import gql from 'graphql-tag';

export const GET_ALL_LANGUAGES_QUERY = gql`
  query GetAllLanguagesQuery {
    getAllLanguages {
      id
      name
      key
      isDefault
      nativeName
    }
  }
`;

export const GET_MESSAGES_BY_KEYS_QUERY = gql`
  query GetMessagesByKeys($keys: [String!]!) {
    getMessagesByKeys(keys: $keys) {
      key
      message {
        key
        value
      }
    }
  }
`;
