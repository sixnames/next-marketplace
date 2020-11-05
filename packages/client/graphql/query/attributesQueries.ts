import { gql } from '@apollo/client';

export const ATTRIBUTES_GROUPS_QUERY = gql`
  query GetAllAttributesGroups {
    getAllAttributesGroups {
      id
      nameString
    }
  }
`;

export const attributeInGroupFragment = gql`
  fragment AttributeInGroup on Attribute {
    id
    name {
      key
      value
    }
    nameString
    variant
    positioningInTitle {
      key
      value
    }
    optionsGroup {
      id
      nameString
    }
    metric {
      id
      nameString
    }
  }
`;

export const ATTRIBUTES_GROUP_QUERY = gql`
  query GetAttributesGroup($id: ID!) {
    getAttributesGroup(id: $id) {
      id
      name {
        key
        value
      }
      nameString
      attributes {
        ...AttributeInGroup
      }
    }
  }
  ${attributeInGroupFragment}
`;

export const ATTRIBUTES_GROUPS_FOR_RUBRIC_QUERY = gql`
  query GetAttributesGroupsForRubric($exclude: [ID!]) {
    getAllAttributesGroups(exclude: $exclude) {
      id
      nameString
    }
  }
`;
