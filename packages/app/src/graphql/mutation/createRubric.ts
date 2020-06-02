import { gql } from '@apollo/client';

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
      rubric {
        id
        name
        level
        type {
          id
          name
        }
        totalProductsCount
        activeProductsCount
        children {
          id
          name
          level
          type {
            id
            name
          }
          totalProductsCount
          activeProductsCount
        }
        parent {
          id
          name
          level
          children {
            id
            name
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
    }
  }
`;
