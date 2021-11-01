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

export const UPDATE_MANY_SHOP_PRODUCTS_MUTATION = gql`
  mutation UpdateManyShopProducts($input: [UpdateShopProductInput!]!) {
    updateManyShopProducts(input: $input) {
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

export const UPDATE_PRODUCT_WITH_SYNC_ERROR_MUTATION = gql`
  mutation UpdateProductWithSyncError($input: UpdateProductWithSyncErrorInput!) {
    updateProductWithSyncError(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_PRODUCT_WITH_SYNC_ERROR_MUTATION = gql`
  mutation CreateProductWithSyncError($input: CreateProductWithSyncErrorInput!) {
    createProductWithSyncError(input: $input) {
      success
      message
      payload {
        _id
        rubricId
      }
    }
  }
`;
