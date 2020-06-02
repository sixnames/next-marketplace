import { gql } from '@apollo/client';

export const UPDATE_RUBRIC_TYPE = gql`
  mutation UpdateRubricType($input: UpdateRubricTypeInput!) {
    updateRubricType(input: $input) {
      success
      message
      type {
        id
        name
      }
    }
  }
`;
