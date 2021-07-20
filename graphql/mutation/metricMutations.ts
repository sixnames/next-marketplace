import { gql } from '@apollo/client';

export const CREATE_METRIC_MUTATION = gql`
  mutation CreateMetric($input: CreateMetricInput!) {
    createMetric(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_METRIC_MUTATION = gql`
  mutation UpdateMetric($input: UpdateMetricInput!) {
    updateMetric(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_METRIC_MUTATION = gql`
  mutation DeleteMetric($_id: ObjectId!) {
    deleteMetric(_id: $_id) {
      success
      message
    }
  }
`;
