import gql from 'graphql-tag';

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
            nameString
          }
        }
      }
    }
  }
`;
