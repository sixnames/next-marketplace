import gql from 'graphql-tag';

export const RUBRIC_ATTRIBUTES_QUERY = gql`
  query GetRubricAttributes($id: ID!) {
    getRubric(id: $id) {
      id
      attributesGroups {
        id
        showInCatalogueFilter
        node {
          id
          nameString
        }
      }
    }
  }
`;
