import gql from 'graphql-tag';

export const GET_FEATURES_AST_OPTIONS_QUERY = gql`
  query GetFeaturesASTOptions($selected: [ID!]!) {
    getFeaturesASTOptions(selected: $selected) {
      id
      name
      attributesGroups {
        node {
          id
          name
          attributes {
            id
            name
            type
            slug
            metric {
              id
              name
            }
            options {
              id
              name
              options {
                id
                name
                color
              }
            }
          }
        }
      }
    }
  }
`;
