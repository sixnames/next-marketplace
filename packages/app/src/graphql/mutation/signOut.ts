import gql from 'graphql-tag';

export const SIGNOUT_MUTATION = gql`
  mutation SignOut {
    signOut {
      success
      message
    }
  }
`;
