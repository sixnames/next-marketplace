import gql from 'graphql-tag';

export const GET_FEATURES_AST_QUERY = gql`
  query GetFeaturesAST($selectedRubrics: [ID!]!) {
    getFeaturesAst(selectedRubrics: $selectedRubrics) {
      id
      nameString
      attributes {
        id
        itemId
        nameString
        variant
        options {
          id
          nameString
          options {
            id
            nameString
            color
          }
        }
      }
    }
  }
`;
