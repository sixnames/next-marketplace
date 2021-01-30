import { gql } from '@apollo/client';

export const UPDATE_SHOP_MUTATION = gql`
  mutation UpdateShop($input: UpdateShopInput!) {
    updateShop(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_SHOP_ASSETS_MUTATION = gql`
  mutation AddShopAssets($input: AddShopAssetsInput!) {
    addShopAssets(input: $input) {
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

export const UPDATE_SHOP_LOGO_MUTATION = gql`
  mutation UpdateShopLogo($input: UpdateShopLogoInput!) {
    updateShopLogo(input: $input) {
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
