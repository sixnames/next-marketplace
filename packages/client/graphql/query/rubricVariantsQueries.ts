import { gql } from '@apollo/client';

export const rubricVariantFragment = gql`
  fragment RubricVariant on RubricVariant {
    id
    nameString
    name {
      key
      value
    }
  }
`;

export const GET_ALL_RUBRIC_VARIANTS = gql`
  query GetAllRubricVariants {
    getAllRubricVariants {
      ...RubricVariant
    }
    getGenderOptions {
      id
      nameString
    }
  }
  ${rubricVariantFragment}
`;
