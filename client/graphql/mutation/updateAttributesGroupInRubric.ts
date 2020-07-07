import gql from 'graphql-tag';
export const UPDATE_ATTRIBUTES_GROUP_IN_RUBRIC = gql`
  mutation UpdateAttributesGroupInRubric($input: UpdateAttributesGroupInRubricInput!) {
    updateAttributesGroupInRubric(input: $input) {
      success
      message
    }
  }
`;
