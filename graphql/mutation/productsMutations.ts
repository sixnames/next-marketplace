import { gql } from '@apollo/client';

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PRODUCT_ASSETS_MUTATION = gql`
  mutation AddProductAssets($input: AddProductAssetsInput!) {
    addProductAssets(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_ASSET_MUTATION = gql`
  mutation DeleteProductAsset($input: DeleteProductAssetInput!) {
    deleteProductAsset(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PRODUCT_ASSET_INDEX_MUTATION = gql`
  mutation UpdateProductAssetIndex($input: UpdateProductAssetIndexInput!) {
    updateProductAssetIndex(input: $input) {
      success
      message
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      success
      message
      payload {
        _id
      }
    }
  }
`;

export const CREATE_PRODUCT_CONNECTION_MUTATION = gql`
  mutation CreateProductConnection($input: CreateProductConnectionInput!) {
    createProductConnection(input: $input) {
      success
      message
    }
  }
`;

export const ADD_PRODUCT_TO_CONNECTION_MUTATION = gql`
  mutation AddProductToConnection($input: AddProductToConnectionInput!) {
    addProductToConnection(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_FROM_CONNECTION_MUTATION = gql`
  mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
    deleteProductFromConnection(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PRODUCT_BRAND_MUTATION = gql`
  mutation UpdateProductBrand($input: UpdateProductBrandInput!) {
    updateProductBrand(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PRODUCT_BRAND_COLLECTION_MUTATION = gql`
  mutation UpdateProductBrandCollection($input: UpdateProductBrandCollectionInput!) {
    updateProductBrandCollection(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PRODUCT_MANUFACTURER_MUTATION = gql`
  mutation UpdateProductManufacturer($input: UpdateProductManufacturerInput!) {
    updateProductManufacturer(input: $input) {
      success
      message
    }
  }
`;
