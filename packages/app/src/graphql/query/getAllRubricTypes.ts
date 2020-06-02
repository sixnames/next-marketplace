import { gql } from '@apollo/client';

export const GET_ALL_RUBRIC_TYPES = gql`
  query GetAllRubricTypes {
    getAllRubricTypes {
      id
      name
    }
  }
`;
