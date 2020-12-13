import { gql } from '@apollo/client';
import { orderStatusFragment } from './ordersQueries';

export const myOrderShopProductFragment = gql`
  fragment MyOrderShopProduct on ShopProduct {
    id
    product {
      id
      mainImage
    }
  }
`;

export const myOrderShopFragment = gql`
  fragment MyOrderShop on Shop {
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
  }
`;

export const myOrderProductFragment = gql`
  fragment MyOrderProduct on OrderProduct {
    id
    itemId
    amount
    formattedPrice
    formattedTotalPrice
    formattedOldPrice
    discountedPercent
    nameString
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
    id
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
  query GetAllMyOrders($input: OrderPaginateInput) {
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
