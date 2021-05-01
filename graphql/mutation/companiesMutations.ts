import { gql } from '@apollo/client';

export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_COMPANY_MUTATION = gql`
  mutation DeleteCompany($_id: ObjectId!) {
    deleteCompany(_id: $_id) {
      success
      message
    }
  }
`;

export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      success
      message
    }
  }
`;

export const ADD_SHOP_TO_COMPANY_MUTATION = gql`
  mutation AddShopToCompany($input: AddShopToCompanyInput!) {
    addShopToCompany(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_SHOP_FROM_COMPANY_MUTATION = gql`
  mutation DeleteShopFromCompany($input: DeleteShopFromCompanyInput!) {
    deleteShopFromCompany(input: $input) {
      success
      message
    }
  }
`;
