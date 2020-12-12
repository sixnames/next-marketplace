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

export const cmsOrderShopProductFragment = gql`
  fragment CmsOrderShopProduct on ShopProduct {
    id
    product {
      id
      mainImage
    }
  }
`;

export const cmsOrderShopFragment = gql`
  fragment CmsOrderShop on Shop {
    id
    nameString
    slug
    address {
      formattedAddress
      formattedCoordinates {
        lat
        lng
      }
    }
    contacts {
      emails
      formattedPhones {
        raw
        readable
      }
    }
    logo {
      index
      url
    }
  }
`;

export const cmsOrderProductFragment = gql`
  fragment CmsOrderProduct on OrderProduct {
    id
    itemId
    amount
    formattedPrice
    formattedTotalPrice
    shopProduct {
      ...CmsOrderShopProduct
    }
    shop {
      ...CmsOrderShop
    }
  }
  ${cmsOrderShopProductFragment}
  ${cmsOrderShopFragment}
`;

export const cmsOrderFragment = gql`
  fragment CmsOrder on Order {
    id
    itemId
    productsCount
    formattedTotalPrice
    comment
    createdAt
    products {
      ...CmsOrderProduct
    }
    status {
      ...OrderStatus
    }
    customer {
      ...CmsOrderInListCustomer
    }
  }
  ${cmsOrderProductFragment}
  ${cmsOrderInListCustomerFragment}
  ${orderStatusFragment}
`;

export const CMS_ORDER_QUERY = gql`
  query GetCmsOrder($id: ID!) {
    getOrder(id: $id) {
      ...CmsOrder
    }
  }
  ${cmsOrderFragment}
`;
