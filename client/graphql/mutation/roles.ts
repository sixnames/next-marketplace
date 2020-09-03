import { gql } from '@apollo/client';

export const CREATE_ROLE_MUTATION = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_ROLE_MUTATION = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      success
      message
    }
  }
`;

export const SET_ROLE_OPERATION_PERMISSION_MUTATION = gql`
  mutation SetRoleOperationPermission($input: SetRoleOperationPermissionInput!) {
    setRoleOperationPermission(input: $input) {
      success
      message
    }
  }
`;

export const SET_ROLE_OPERATION_CUSTOM_FILTER_MUTATION = gql`
  mutation SetRoleOperationCustomFilter($input: SetRoleOperationCustomFilterInput!) {
    setRoleOperationCustomFilter(input: $input) {
      success
      message
    }
  }
`;

export const SET_ROLE_RULE_RESTRICTED_FIELD_MUTATION = gql`
  mutation SetRoleRuleRestrictedField($input: SetRoleRuleRestrictedFieldInput!) {
    setRoleRuleRestrictedField(input: $input) {
      success
      message
    }
  }
`;

export const SET_ROLE_RULE_ALLOWED_NAV_ITEM_MUTATION = gql`
  mutation SetRoleAllowedNavItem($input: SetRoleAllowedNavItemInput!) {
    setRoleAllowedNavItem(input: $input) {
      success
      message
    }
  }
`;
