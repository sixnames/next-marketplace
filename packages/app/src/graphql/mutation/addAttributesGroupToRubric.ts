import gql from 'graphql-tag';

export const ADD_ATTRIBUTES_GROUP_TO_RUBRIC = gql`
  mutation AddAttributesGroupToRubric($input: AddAttributesGroupToRubricInput!) {
    addAttributesGroupToRubric(input: $input) {
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
