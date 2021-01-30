import { gql } from '@apollo/client';

export const rubricVariantFragment = gql`
  fragment RubricVariant on RubricVariant {
    _id
    name
    nameI18n
  }
`;

export const GET_ALL_RUBRIC_VARIANTS = gql`
  query GetAllRubricVariants {
    getAllRubricVariants {
      ...RubricVariant
    }
    getGenderOptions {
      _id
      name
    }
  }
  ${rubricVariantFragment}
`;
