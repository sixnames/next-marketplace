import { gql } from '@apollo/client';

export const UPDATE_SINGLE_CONFIG_MUTATION = gql`
  mutation UpdateConfig($input: UpdateConfigInput!) {
    updateConfig(input: $input) {
      success
      message
    }
  }
`;
