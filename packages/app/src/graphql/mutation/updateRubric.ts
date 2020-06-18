import gql from 'graphql-tag';

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
        variant {
          id
          nameString
        }
        totalProductsCount
        activeProductsCount
      }
    }
  }
`;
