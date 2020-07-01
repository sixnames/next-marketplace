import gql from 'graphql-tag';

export const INITIAL_QUERY = gql`
  query Initial {
    me {
      id
      email
      name
      secondName
      lastName
      fullName
      shortName
      phone
      role
      isAdmin
      isManager
      isCustomer
    }
  }
`;
