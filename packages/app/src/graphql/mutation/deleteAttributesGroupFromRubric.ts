import { gql } from '@apollo/client';

export const DELETE_ATTRIBUTES_GROUP_FROM_RUBRIC = gql`
  mutation DeleteAttributesGroupFromRubric($input: DeleteAttributesGroupFromRubricInput!) {
    deleteAttributesGroupFromRubric(input: $input) {
      success
      message
      rubric {
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
  }
`;
