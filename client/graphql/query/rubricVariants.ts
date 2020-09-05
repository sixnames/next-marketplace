import { gql } from '@apollo/client';

export const GET_ALL_RUBRIC_VARIANTS = gql`
  query GetAllRubricVariants {
    getAllRubricVariants {
      id
      nameString
      name {
        key
        value
      }
    }
    getGenderOptions {
      id
      nameString
    }
  }
`;
