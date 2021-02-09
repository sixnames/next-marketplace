import { gql } from '@apollo/client';

export const ATTRIBUTES_GROUPS_QUERY = gql`
  query GetAllAttributesGroups {
    getAllAttributesGroups {
      _id
      name
    }
  }
`;

export const attributeInGroupFragment = gql`
  fragment AttributeInGroup on Attribute {
    _id
    nameI18n
    name
    variant
    viewVariant
    positioningInTitle
    optionsGroupId
    optionsGroup {
      _id
      name
    }
    metric {
      _id
      name
    }
  }
`;

export const ATTRIBUTES_GROUP_QUERY = gql`
  query GetAttributesGroup($_id: ObjectId!) {
    getAttributesGroup(_id: $_id) {
      _id
      nameI18n
      name
      attributes {
        ...AttributeInGroup
      }
    }
  }
  ${attributeInGroupFragment}
`;

export const ATTRIBUTES_GROUPS_FOR_RUBRIC_QUERY = gql`
  query GetAttributesGroupsForRubric($excludedIds: [ObjectId!]) {
    getAllAttributesGroups(excludedIds: $excludedIds) {
      _id
      name
    }
  }
`;
