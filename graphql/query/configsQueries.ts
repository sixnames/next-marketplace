import { gql } from '@apollo/client';

export const siteConfigFragment = gql`
  fragment SiteConfig on Config {
    _id
    slug
    value
    singleValue
    name
    description
    variant
    acceptedFormats
    multi
    cities
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
