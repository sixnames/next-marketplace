import { gql } from '@apollo/client';

export const CREATE_RUBRIC_TYPE = gql`
  mutation CreateRubricType($input: CreateRubricTypeInput!) {
    createRubricType(input: $input) {
      success
      message
      type {
        id
        name
      }
    }
  }
`;
