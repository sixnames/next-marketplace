import gql from 'graphql-tag';

export const GET_FEATURES_AST_OPTIONS_QUERY = gql`
  query GetFeaturesASTOptions($selected: [ID!]!) {
    getFeaturesASTOptions(selected: $selected) {
      id
      nameString
      attributesGroups {
        node {
          id
          nameString
          attributes {
            id
            itemId
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
                nameString
                color
              }
            }
          }
        }
      }
    }
  }
`;
