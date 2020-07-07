import gql from 'graphql-tag';

export const RUBRIC_ATTRIBUTES_QUERY = gql`
  query GetRubricAttributes($id: ID!) {
    getRubric(id: $id) {
      id
      level
      attributesGroups {
        id
        showInCatalogueFilter
        node {
          id
          nameString
          attributes {
            id
            nameString
            variant
            metric {
              id
              nameString
            }
            options {
              id
              nameString
            }
          }
        }
      }
    }
  }
`;
