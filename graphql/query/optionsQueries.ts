import { gql } from '@apollo/client';

export const optionsGroupInlistFragment = gql`
  fragment OptionsGroupInlist on OptionsGroup {
    _id
    name
    options {
      _id
    }
  }
`;

export const OPTIONS_GROUPS_QUERY = gql`
  query GetAllOptionsGroups {
    getAllOptionsGroups {
      ...OptionsGroupInlist
    }
  }
  ${optionsGroupInlistFragment}
`;

export const optionInGroupFragment = gql`
  fragment OptionInGroup on Option {
    _id
    nameI18n
    name
    color
    icon
    gender
    variants
  }
`;

export const optionsGroupFragment = gql`
  fragment OptionsGroup on OptionsGroup {
    _id
    nameI18n
    variant
    name
    options {
      ...OptionInGroup
    }
  }
  ${optionInGroupFragment}
`;

export const OPTIONS_GROUP_QUERY = gql`
  query GetOptionsGroup($_id: ObjectId!) {
    getOptionsGroup(_id: $_id) {
      ...OptionsGroup
    }
  }
  ${optionsGroupFragment}
`;
