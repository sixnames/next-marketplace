import { gql } from '@apollo/client';

export const CREATE_BRAND_MUTATION = gql`
  mutation CreateBrand($input: CreateBrandInput!) {
    createBrand(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_BRAND_MUTATION = gql`
  mutation UpdateBrand($input: UpdateBrandInput!) {
    updateBrand(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_BRAND_MUTATION = gql`
  mutation DeleteBrand($_id: ObjectId!) {
    deleteBrand(_id: $_id) {
      success
      message
    }
  }
`;

export const ADD_COLLECTION_TO_BRAND_MUTATION = gql`
  mutation AddCollectionToBrand($input: AddCollectionToBrandInput!) {
    addCollectionToBrand(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_COLLECTION_IN_BRAND_MUTATION = gql`
  mutation UpdateCollectionInBrand($input: UpdateCollectionInBrandInput!) {
    updateCollectionInBrand(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_COLLECTION_FROM_BRAND_MUTATION = gql`
  mutation DeleteCollectionFromBrand($input: DeleteCollectionFromBrandInput!) {
    deleteCollectionFromBrand(input: $input) {
      success
      message
    }
  }
`;
