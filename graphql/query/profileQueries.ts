import { gql } from '@apollo/client';
import { orderStatusFragment } from './ordersQueries';

export const myOrderShopProductFragment = gql`
  fragment MyOrderShopProduct on ShopProduct {
    _id
    available
    inCartCount
    product {
      _id
      slug
      itemId
      mainImage
    }
  }
`;

export const myOrderShopFragment = gql`
  fragment MyOrderShop on Shop {
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
  }
`;

export const myOrderProductFragment = gql`
  fragment MyOrderProduct on OrderProduct {
    _id
    itemId
    amount
    formattedPrice
    formattedTotalPrice
    formattedOldPrice
    discountedPercent
    name
    shopProduct {
      ...MyOrderShopProduct
    }
    shop {
      ...MyOrderShop
    }
  }
  ${myOrderShopProductFragment}
  ${myOrderShopFragment}
`;

export const myOrderFragment = gql`
  fragment MyOrder on Order {
    _id
    itemId
    productsCount
    formattedTotalPrice
    comment
    createdAt
    products {
      ...MyOrderProduct
    }
    status {
      ...OrderStatus
    }
  }
  ${myOrderProductFragment}
  ${orderStatusFragment}
`;

export const MY_ORDERS_QUERY = gql`
  query GetAllMyOrders($input: PaginationInput) {
    getAllMyOrders(input: $input) {
      totalDocs
      page
      totalPages
      docs {
        ...MyOrder
      }
    }
  }
  ${myOrderFragment}
`;
