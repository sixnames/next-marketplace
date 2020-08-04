import gql from 'graphql-tag';

export const GET_ALL_CONFIGS_QUERY = gql`
  query GetAllConfigs {
    getAllConfigs {
      id
      slug
      value
      nameString
      description
      variant
    }
  }
`;
