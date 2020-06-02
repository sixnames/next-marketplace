import { gql } from '@apollo/client';

export const DELETE_RUBRIC_TYPE = gql`
  mutation DeleteRubricType($input: DeleteRubricTypeInput!) {
    deleteRubricType(input: $input) {
      success
      message
    }
  }
`;
