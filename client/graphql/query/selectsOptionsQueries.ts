import gql from 'graphql-tag';

export const GET_GENDER_OPTIONS_QUERY = gql`
  query GetGenderOptions {
    getGenderOptions {
      id
      nameString
    }
  }
`;
