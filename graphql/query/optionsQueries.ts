import { gql } from '@apollo/client';

export const OPTIONS_GROUPS_QUERY = gql`
  query GetAllOptionsGroups {
    getAllOptionsGroups {
      _id
      name
      options {
        _id
      }
    }
  }
`;

export const optionInGroupFragment = gql`
  fragment OptionInGroup on Option {
    _id
    nameI18n
    name
    color
    icon
    gender
    variants {
      gender
      value
    }
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
