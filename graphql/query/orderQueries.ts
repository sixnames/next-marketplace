import { gql } from '@apollo/client';

export const GET_NEW_ORDERS_COUNTER_QUERY = gql`
  query GetNewOrdersCounter($input: GetNewOrdersCounterInput) {
    getNewOrdersCounter(input: $input)
  }
`;
