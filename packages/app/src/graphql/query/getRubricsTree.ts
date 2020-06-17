import gql from 'graphql-tag';

export const RUBRICS_TREE_QUERY = gql`
  query GetRubricsTree($excluded: [ID!]) {
    getRubricsTree(excluded: $excluded) {
      id
      name
      level
      variant {
        id
        nameString
      }
      totalProductsCount
      activeProductsCount
      children(excluded: $excluded) {
        id
        name
        level
        variant {
          id
          nameString
        }
        totalProductsCount
        activeProductsCount
        children(excluded: $excluded) {
          id
          name
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
  }
`;
