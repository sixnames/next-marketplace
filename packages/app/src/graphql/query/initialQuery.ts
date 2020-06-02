import { gql } from '@apollo/client';

export const initial = gql`
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
`;
