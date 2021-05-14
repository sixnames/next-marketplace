import { gql } from '@apollo/client';

export const ATTRIBUTES_GROUPS_FOR_RUBRIC_QUERY = gql`
  query GetAttributesGroupsForRubric($excludedIds: [ObjectId!]) {
    getAllAttributesGroups(excludedIds: $excludedIds) {
      _id
      name
    }
  }
`;
