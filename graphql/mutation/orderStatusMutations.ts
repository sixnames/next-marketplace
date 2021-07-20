import { gql } from '@apollo/client';

export const CREATE_ORDER_STATUS_MUTATION = gql`
  mutation CreateOrderStatus($input: CreateOrderStatusInput!) {
    createOrderStatus(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($input: UpdateOrderStatusInput!) {
    updateOrderStatus(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_ORDER_STATUS_MUTATION = gql`
  mutation DeleteOrderStatus($_id: ObjectId!) {
    deleteOrderStatus(_id: $_id) {
      success
      message
    }
  }
`;
