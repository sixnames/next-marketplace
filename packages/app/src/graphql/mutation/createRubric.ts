import gql from 'graphql-tag';

export const CREATE_RUBRIC_MUTATION = gql`
  mutation CreateRubric($input: CreateRubricInput!) {
    createRubric(input: $input) {
      success
      message
      rubric {
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
        parent {
          id
          name
          level
          children {
            id
            name
            level
            variant {
              id
              nameString
            }
            #            totalProductsCount
            #            activeProductsCount
          }
        }
      }
    }
  }
`;
