import gql from 'graphql-tag';

export const SIGN_IN = gql`
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
      }
    }
  }
`;
