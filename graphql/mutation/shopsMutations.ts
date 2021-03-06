import { gql } from '@apollo/client';

export const UPDATE_SHOP_MUTATION = gql`
  mutation UpdateShop($input: UpdateShopInput!) {
    updateShop(input: $input) {
      success
      message
    }
  }
`;

export const GENERATE_SHOP_TOKEN_MUTATION = gql`
  mutation GenerateShopToken($_id: ObjectId!) {
    generateShopToken(_id: $_id) {
      success
      message
    }
  }
`;

export const DELETE_SHOP_ASSET_MUTATION = gql`
  mutation DeleteShopAsset($input: DeleteShopAssetInput!) {
    deleteShopAsset(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_SHOP_ASSET_INDEX_MUTATION = gql`
  mutation UpdateShopAssetIndex($input: UpdateShopAssetIndexInput!) {
    updateShopAssetIndex(input: $input) {
      success
      message
    }
  }
`;

export const ADD_MANY_SHOP_PRODUCTS_MUTATION = gql`
  mutation AddManyProductsToShop($input: [AddProductToShopInput!]!) {
    addManyProductsToShop(input: $input) {
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

export const ADD_SHOP_PRODUCT_SUPPLIER_MUTATION = gql`
  mutation AddShopProductSupplier($input: AddShopProductSupplierInput!) {
    addShopProductSupplier(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_SHOP_PRODUCT_SUPPLIER_MUTATION = gql`
  mutation UpdateShopProductSupplier($input: UpdateShopProductSupplierInput!) {
    updateShopProductSupplier(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_SHOP_PRODUCT_SUPPLIER_MUTATION = gql`
  mutation DeleteShopProductSupplier($_id: ObjectId!) {
    deleteShopProductSupplier(_id: $_id) {
      success
      message
    }
  }
`;
