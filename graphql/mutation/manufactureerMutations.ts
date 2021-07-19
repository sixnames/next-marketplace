import { gql } from '@apollo/client';

export const CREATE_MANUFACTURER_MUTATION = gql`
  mutation CreateManufacturer($input: CreateManufacturerInput!) {
    createManufacturer(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_MANUFACTURER_MUTATION = gql`
  mutation UpdateManufacturer($input: UpdateManufacturerInput!) {
    updateManufacturer(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_MANUFACTURER_MUTATION = gql`
  mutation DeleteManufacturer($_id: ObjectId!) {
    deleteManufacturer(_id: $_id) {
      success
      message
    }
  }
`;
