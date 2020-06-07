import gql from 'graphql-tag';

export const RUBRIC_QUERY = gql`
  query GetRubric($id: ID!) {
    getRubric(id: $id) {
      id
      name
      catalogueName
      level
      variant {
        id
        nameString
      }
      #      totalProductsCount
      #      activeProductsCount
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
        variant {
          id
          nameString
        }
        #        totalProductsCount
        #        activeProductsCount
        children {
          id
          name
          level
          variant {
            id
            nameString
          }
          #          totalProductsCount
          #          activeProductsCount
        }
      }
    }
  }
`;
