import { gql } from '@apollo/client';

export const ATTRIBUTES_GROUPS_FOR_RUBRIC_QUERY = gql`
  query GetAttributesGroupsForRubric($exclude: [ID]) {
    getAllAttributesGroups(exclude: $exclude) {
      id
      name
    }
  }
`;
