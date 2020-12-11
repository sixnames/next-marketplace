import { gql } from '@apollo/client';

export const orderStatusFragment = gql`
  fragment OrderStatus on OrderStatus {
    id
    nameString
  }
`;

export const cmsOrderInListCustomerFragment = gql`
  fragment CmsOrderInListCustomer on OrderCustomer {
    id
    itemId
    shortName
    formattedPhone {
      raw
      readable
    }
    email
  }
`;

export const cmsOrderInListFragment = gql`
  fragment CmsOrderInList on Order {
    id
    itemId
    productsCount
    formattedTotalPrice
    comment
    createdAt
    status {
      ...OrderStatus
    }
    customer {
      ...CmsOrderInListCustomer
    }
  }
  ${cmsOrderInListCustomerFragment}
  ${orderStatusFragment}
`;

export const CMS_ORDERS_QUERY = gql`
  query GetAllCMSOrders($input: OrderPaginateInput) {
    getAllOrders(input: $input) {
      totalDocs
      page
      totalPages
      docs {
        ...CmsOrderInList
      }
    }
  }
  ${cmsOrderInListFragment}
`;
