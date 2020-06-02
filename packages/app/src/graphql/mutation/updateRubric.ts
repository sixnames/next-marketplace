import { gql } from '@apollo/client';

export const UPDATE_RUBRIC = gql`
  mutation UpdateRubric($input: UpdateRubricInput!) {
    updateRubric(input: $input) {
      success
      message
      rubric {
        id
        name
        catalogueName
        level
        type {
          id
          name
        }
        totalProductsCount
        activeProductsCount
      }
    }
  }
`;
