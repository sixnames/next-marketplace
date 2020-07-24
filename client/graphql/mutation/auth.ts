import gql from 'graphql-tag';

export const SIGN_IN_MUTATION = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      success
      message
      user {
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
  }
`;

export const SIGNOUT_MUTATION = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;
