import { gql } from '@apollo/client';

export const CONFIRM_ORDER_MUTATION = gql`
  mutation ConfirmOrder($input: ConfirmOrderInput!) {
    confirmOrder(input: $input) {
      success
      message
    }
  }
`;
