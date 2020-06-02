import { gql } from '@apollo/client';

export const RUBRICS_TREE_QUERY = gql`
  query GetRubricsTree($excluded: [ID!]) {
    getRubricsTree(excluded: $excluded) {
      id
      name
      level
      type {
        id
        name
      }
      totalProductsCount
      activeProductsCount
      children(excluded: $excluded) {
        id
        name
        level
        type {
          id
          name
        }
        totalProductsCount
        activeProductsCount
        children(excluded: $excluded) {
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
