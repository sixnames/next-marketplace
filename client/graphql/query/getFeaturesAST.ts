import gql from 'graphql-tag';

export const GET_FEATURES_AST_QUERY = gql`
  query GetFeaturesAST($selectedRubrics: [ID!]!) {
    getFeaturesAst(selectedRubrics: $selectedRubrics) {
      id
      nameString
      attributes {
        id
        slug
        nameString
        variant
        metric {
          id
          nameString
        }
        options {
          id
          nameString
          options {
            id
            slug
            nameString
            color
          }
        }
      }
    }
  }
`;
