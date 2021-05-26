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
  mutation DeleteRole($_id: ObjectId!) {
    deleteRole(_id: $_id) {
      success
      message
    }
  }
`;

export const UPDATE_ROLE_RULE_MUTATION = gql`
  mutation UpdateRoleRule($input: UpdateRoleRuleInput!) {
    updateRoleRule(input: $input) {
      success
      message
    }
  }
`;
