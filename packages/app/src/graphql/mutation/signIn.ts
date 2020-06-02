import { gql } from '@apollo/client';

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
        isBookkeeper
        isContractor
        isDriver
        isHelper
        isLogistician
        isManager
        isStage
        isWarehouse
        isSuper
      }
    }
  }
`;
