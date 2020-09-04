import { gql } from '@apollo/client';
import { sessionUserFragment } from '../initialQuery';

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      success
      message
      user {
        ...SessionUserFragment
      }
    }
  }
  ${sessionUserFragment}
`;

export const UPDATE_MY_PASSWORD_MUTATION = gql`
  mutation UpdateMyPassword($input: UpdateMyPasswordInput!) {
    updateMyPassword(input: $input) {
      success
      message
      user {
        ...SessionUserFragment
      }
    }
  }
  ${sessionUserFragment}
`;
