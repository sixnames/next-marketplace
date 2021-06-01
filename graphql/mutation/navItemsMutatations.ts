import { gql } from '@apollo/client';

export const CREATE_NAV_ITEM_MUTATION = gql`
  mutation CreateNavItem($input: CreateNavItemInput!) {
    createNavItem(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_NAV_ITEM_MUTATION = gql`
  mutation UpdateNavItem($input: UpdateNavItemInput!) {
    updateNavItem(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_NAV_ITEM_MUTATION = gql`
  mutation DeleteNavItem($_id: ObjectId!) {
    deleteNavItem(_id: $_id) {
      success
      message
    }
  }
`;
