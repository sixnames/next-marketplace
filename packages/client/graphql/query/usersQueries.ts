import { gql } from '@apollo/client';

export const userInListFragment = gql`
  fragment UserInList on User {
    id
    itemId
    email
    phone
    fullName
    shortName
    role {
      id
      nameString
    }
  }
`;

export const USERS_SEARCH_QUERY = gql`
  query UsersSerch($input: UserPaginateInput!) {
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
