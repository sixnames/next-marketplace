import { gql } from '@apollo/client';

export const siteConfigFragment = gql`
  fragment SiteConfig on Config {
    id
    slug
    value
    nameString
    description
    variant
    acceptedFormats
    multi
    cities {
      key
      translations {
        key
        value
      }
    }
  }
`;

export const GET_ALL_CONFIGS_QUERY = gql`
  query GetAllConfigs {
    getAllConfigs {
      ...SiteConfig
    }
  }
  ${siteConfigFragment}
`;
