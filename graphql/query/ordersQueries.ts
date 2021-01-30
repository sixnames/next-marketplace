import { gql } from '@apollo/client';

export const orderStatusFragment = gql`
  fragment OrderStatus on OrderStatus {
    _id
    name
    color
  }
`;

export const cmsOrderInListCustomerFragment = gql`
  fragment CmsOrderInListCustomer on OrderCustomer {
    _id
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
    _id
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
  query GetAllCMSOrders($input: PaginationInput) {
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
    _id
    product {
      _id
      mainImage
    }
  }
`;

export const cmsOrderShopFragment = gql`
  fragment CmsOrderShop on Shop {
    _id
    name
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
    _id
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
    _id
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
  query GetCmsOrder($_id: ObjectId!) {
    getOrder(_id: $_id) {
      ...CmsOrder
    }
  }
  ${cmsOrderFragment}
`;
