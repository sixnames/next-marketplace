import { gql } from '@apollo/client';

export const UPDATE_SINGLE_CONFIG_MUTATION = gql`
  mutation UpdateConfig($input: UpdateConfigInput!) {
    updateConfig(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_VISIBLE_CATEGORIES_IN_NAV_DROPDOWN_MUTATION = gql`
  mutation UpdateVisibleCategoriesInNavDropdown(
    $input: UpdateVisibleCategoriesInNavDropdownInput!
  ) {
    updateVisibleCategoriesInNavDropdown(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_RUBRIC_NAV_ITEM_CONFIG_MUTATION = gql`
  mutation UpdateRubricNavItemConfig($input: UpdateRubricNavItemConfigInput!) {
    updateRubricNavItemConfig(input: $input) {
      success
      message
    }
  }
`;
