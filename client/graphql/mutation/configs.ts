import gql from 'graphql-tag';

export const UPDATE_CONFIGS_MUTATION = gql`
  mutation UpdateConfigs($input: [UpdateConfigInput!]!) {
    updateConfigs(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_ASSET_CONFIG_MUTATION = gql`
  mutation UpdateAssetConfig($input: UpdateAssetConfigInput!) {
    updateAssetConfig(input: $input) {
      success
      message
    }
  }
`;
