import { gql } from '@apollo/client';

export const UPDATE_MY_PROFILE_MUTATION = gql`
  mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
    updateMyProfile(input: $input) {
      success
      message
      payload {
        _id
        email
      }
    }
  }
`;

export const UPDATE_MY_PASSWORD_MUTATION = gql`
  mutation UpdateMyPassword($input: UpdateMyPasswordInput!) {
    updateMyPassword(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($_id: ObjectId!) {
    deleteUser(_id: $_id) {
      success
      message
    }
  }
`;
