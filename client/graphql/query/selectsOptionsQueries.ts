import gql from 'graphql-tag';

export const GET_GENDER_OPTIONS_QUERY = gql`
  query GetGenderOptions {
    getGenderOptions {
      id
      nameString
    }
  }
`;

export const LANGUAGES_ISO__OPTIONS_QUERY = gql`
  query GetISOLanguagesList {
    getISOLanguagesList {
      id
      nameString
      nativeName
    }
  }
`;
