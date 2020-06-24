import gql from 'graphql-tag';

export const GET_ALL_RUBRIC_VARIANTS = gql`
  query GetAllRubricVariants {
    getAllRubricVariants {
      id
      nameString
    }
  }
`;
