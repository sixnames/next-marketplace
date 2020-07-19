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
