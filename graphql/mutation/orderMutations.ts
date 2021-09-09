import { gql } from '@apollo/client';

export const CONFIRM_ORDER_MUTATION = gql`
  mutation ConfirmOrder($input: ConfirmOrderInput!) {
    confirmOrder(input: $input) {
      success
      message
    }
  }
`;

export const CANCEL_ORDER_MUTATION = gql`
  mutation CancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      success
      message
    }
  }
`;
