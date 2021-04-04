import { gql } from '@apollo/client';
import { cartFragment } from '../mutation/cartMutations';

export const appNavItemFragment = gql`
  fragment AppNavItem on NavItem {
    _id
    name
    icon
    path
  }
`;

export const appNavParentItemFragment = gql`
  fragment AppNavParentItem on NavItem {
    ...AppNavItem
    appNavigationChildren {
      ...AppNavItem
    }
  }
  ${appNavItemFragment}
`;

export const sessionRoleFragment = gql`
  fragment SessionRoleFragment on Role {
    _id
    name
    slug
    isStuff
    appNavigation {
      ...AppNavParentItem
    }
    cmsNavigation {
      ...AppNavParentItem
    }
  }
  ${appNavParentItemFragment}
`;

export const sessionUserFragment = gql`
  fragment SessionUser on User {
    _id
    email
    name
    secondName
    lastName
    fullName
    shortName
    phone
    role {
      ...SessionRoleFragment
    }
  }
  ${sessionRoleFragment}
`;

export const SESSION_USER_QUERY = gql`
  query SessionUser {
    me {
      ...SessionUser
    }
  }
  ${sessionUserFragment}
`;

export const SESSION_CART_QUERY = gql`
  query SessionCart {
    getSessionCart {
      ...Cart
    }
  }
  ${cartFragment}
`;
