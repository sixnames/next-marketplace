import { gql } from '@apollo/client';

export const CREATE_PAGES_GROUP_MUTATION = gql`
  mutation CreatePagesGroup($input: CreatePagesGroupInput!) {
    createPagesGroup(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PAGES_GROUP_MUTATION = gql`
  mutation UpdatePagesGroup($input: UpdatePagesGroupInput!) {
    updatePagesGroup(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PAGES_GROUP_MUTATION = gql`
  mutation DeletePagesGroup($input: DeletePagesGroupInput!) {
    deletePagesGroup(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_PAGE_MUTATION = gql`
  mutation CreatePage($input: CreatePageInput!) {
    createPage(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PAGE_MUTATION = gql`
  mutation UpdatePage($input: UpdatePageInput!) {
    updatePage(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PAGE_MUTATION = gql`
  mutation DeletePage($input: DeletePageInput!) {
    deletePage(input: $input) {
      success
      message
    }
  }
`;
