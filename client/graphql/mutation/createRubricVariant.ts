import gql from 'graphql-tag';

export const CREATE_RUBRIC_VARIANT = gql`
  mutation CreateRubricVariant($input: CreateRubricVariantInput!) {
    createRubricVariant(input: $input) {
      success
      message
      variant {
        id
        nameString
      }
    }
  }
`;
