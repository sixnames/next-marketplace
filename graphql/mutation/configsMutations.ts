import { gql } from '@apollo/client';

export const UPDATE_SINGLE_CONFIG_MUTATION = gql`
  mutation UpdateConfig($input: UpdateConfigInput!) {
    updateConfig(input: $input) {
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
