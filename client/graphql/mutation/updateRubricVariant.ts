import gql from 'graphql-tag';

export const UPDATE_RUBRIC_VARIANT = gql`
  mutation UpdateRubricVariant($input: UpdateRubricVariantInput!) {
    updateRubricVariant(input: $input) {
      success
      message
      variant {
        id
        nameString
      }
    }
  }
`;
