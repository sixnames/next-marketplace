import { gql } from '@apollo/client';

export const RUBRIC_QUERY = gql`
  query GetRubric($id: ID!) {
    getRubric(id: $id) {
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
      parent {
        id
        name
        parent {
          id
          name
        }
      }
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
`;
