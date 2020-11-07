import { gql } from '@apollo/client';

export const GET_ALL_ROLES_QUERY = gql`
  query GetAllRoles {
    getAllRoles {
      id
      nameString
    }
  }
`;

export const roleRuleFragment = gql`
  fragment RoleRule on RoleRule {
    id
    entity
    nameString
    nameString
    restrictedFields
    operations {
      id
      allow
      customFilter
      operationType
    }
  }
`;

export const roleFragment = gql`
  fragment Role on Role {
    id
    nameString
    allowedAppNavigation
    description
    isStuff
    name {
      key
      value
    }
    rules {
      ...RoleRule
    }
  }
  ${roleRuleFragment}
`;

export const GET_ROLE_QUERY = gql`
  query GetRole($id: ID!) {
    getRole(id: $id) {
      ...Role
    }
  }
  ${roleFragment}
`;

export const GET_ENTITY_FIELDS_QUERY = gql`
  query GetEntityFields($entity: String!) {
    getEntityFields(entity: $entity)
  }
`;

export const appNavItemFragment = gql`
  fragment AppNavItem on NavItem {
    id
    nameString
    path
    children {
      id
      nameString
      path
    }
  }
`;

export const GET_ALL_APP_NAV_ITEMS_QUERY = gql`
  query GetAllAppNavItems {
    getAllAppNavItems {
      ...AppNavItem
    }
  }
  ${appNavItemFragment}
`;
