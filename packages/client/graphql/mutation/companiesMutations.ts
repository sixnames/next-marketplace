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
  mutation DeleteCompany($id: ID!) {
    deleteCompany(id: $id) {
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

export const UPDATE_SHOP_MUTATION = gql`
  mutation UpdateShop($input: UpdateShopInput!) {
    updateShop(input: $input) {
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

export const ADD_PRODUCT_TO_SHOP_MUTATION = gql`
  mutation AddProductToShop($input: AddProductToShopInput!) {
    addProductToShop(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_SHOP_PRODUCT_MUTATION = gql`
  mutation UpdateShopProduct($input: UpdateShopProductInput!) {
    updateShopProduct(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_FROM_SHOP_MUTATION = gql`
  mutation DeleteProductFromShop($input: DeleteProductFromShopInput!) {
    deleteProductFromShop(input: $input) {
      success
      message
    }
  }
`;
