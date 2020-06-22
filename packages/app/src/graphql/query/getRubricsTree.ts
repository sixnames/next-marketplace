import gql from 'graphql-tag';

export const RUBRICS_TREE_QUERY = gql`
  query GetRubricsTree($excluded: [ID!], $counters: ProductsCountersInput!) {
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
    getProductsCounters(input: $counters) {
      totalProductsCount
      activeProductsCount
    }
  }
`;
