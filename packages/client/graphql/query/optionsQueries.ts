import { gql } from '@apollo/client';

export const OPTIONS_GROUPS_QUERY = gql`
  query GetAllOptionsGroups {
    getAllOptionsGroups {
      id
      nameString
      options {
        id
      }
    }
  }
`;

export const optionInGroupFragment = gql`
  fragment OptionInGroup on Option {
    id
    name {
      key
      value
    }
    nameString
    color
    icon
    gender
    variants {
      key
      value {
        key
        value
      }
    }
  }
`;

export const optionsGroupFragment = gql`
  fragment OptionsGroup on OptionsGroup {
    id
    name {
      key
      value
    }
    variant
    nameString
    options {
      ...OptionInGroup
    }
  }
  ${optionInGroupFragment}
`;

export const OPTIONS_GROUP_QUERY = gql`
  query GetOptionsGroup($id: ID!) {
    getOptionsGroup(id: $id) {
      ...OptionsGroup
    }
  }
  ${optionsGroupFragment}
`;
