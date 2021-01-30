import { gql } from '@apollo/client';

export const userInListFragment = gql`
  fragment UserInList on User {
    _id
    itemId
    email
    fullName
    shortName
    formattedPhone {
      raw
      readable
    }
    role {
      _id
      name
    }
  }
`;

export const USERS_SEARCH_QUERY = gql`
  query UsersSerch($input: PaginationInput!) {
    getAllUsers(input: $input) {
      totalDocs
      page
      totalPages
      docs {
        ...UserInList
      }
    }
  }
  ${userInListFragment}
`;
