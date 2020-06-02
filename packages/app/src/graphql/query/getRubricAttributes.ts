import { gql } from '@apollo/client';

export const RUBRIC_ATTRIBUTES_QUERY = gql`
  query GetRubricAttributes($id: ID!) {
    getRubric(id: $id) {
      id
      attributesGroups {
        showInCatalogueFilter
        node {
          id
          name
        }
      }
    }
  }
`;
