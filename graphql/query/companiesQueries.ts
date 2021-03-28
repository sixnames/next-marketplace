import { gql } from '@apollo/client';
import { userInListFragment } from './usersQueries';

export const companyInListFragment = gql`
  fragment CompanyInList on Company {
    _id
    itemId
    slug
    name
    ownerId
    staffIds
    domain
    owner {
      _id
      fullName
    }
    logo {
      url
    }
  }
`;

export const COMPANIES_LIST_QUERY = gql`
  query GetAllCompanies($input: PaginationInput) {
    getAllCompanies(input: $input) {
      totalDocs
      page
      totalPages
      docs {
        ...CompanyInList
      }
    }
  }
  ${companyInListFragment}
`;

export const shopInListFragment = gql`
  fragment ShopInList on Shop {
    _id
    itemId
    slug
    name
    companyId
    city {
      _id
      name
      slug
    }
    logo {
      index
      url
    }
  }
`;

export const companyFragment = gql`
  fragment Company on Company {
    _id
    itemId
    slug
    name
    ownerId
    staffIds
    domain
    staff {
      ...UserInList
    }
    owner {
      ...UserInList
    }
    logo {
      index
      url
    }
    contacts {
      emails
      phones
    }
  }
  ${userInListFragment}
`;

export const COMPANY_QUERY = gql`
  query GetCompany($_id: ObjectId!) {
    getCompany(_id: $_id) {
      ...Company
    }
  }
  ${companyFragment}
`;

export const COMPANY_SHOPS_QUERY = gql`
  query GetCompanyShops($companyId: ObjectId!, $input: PaginationInput) {
    getCompany(_id: $companyId) {
      _id
      shops(input: $input) {
        totalPages
        docs {
          ...ShopInList
        }
      }
    }
  }
  ${shopInListFragment}
`;

export const SHOPS_QUERY = gql`
  query GetAllShops($input: PaginationInput) {
    getAllShops(input: $input) {
      totalPages
      docs {
        ...ShopInList
      }
    }
  }
  ${shopInListFragment}
`;

export const shopProductNodeFragment = gql`
  fragment ShopProductNode on Product {
    _id
    itemId
    name
    mainImage
  }
`;

export const shopProductFragment = gql`
  fragment ShopProduct on ShopProduct {
    _id
    available
    price
    product {
      ...ShopProductNode
    }
  }
  ${shopProductNodeFragment}
`;

export const shopFragment = gql`
  fragment Shop on Shop {
    _id
    slug
    itemId
    name
    companyId
    contacts {
      emails
      phones
    }
    city {
      _id
      name
      slug
    }
    address {
      formattedAddress
      point {
        coordinates
      }
    }
    logo {
      index
      url
    }
    assets {
      index
      url
    }
  }
`;

export const SHOP_QUERY = gql`
  query GetShop($_id: ObjectId!) {
    getShop(_id: $_id) {
      ...Shop
    }
  }
  ${shopFragment}
`;

export const SHOP_PRODUCTS_QUERY = gql`
  query GetShopProducts($shopId: ObjectId!, $input: PaginationInput) {
    getShop(_id: $shopId) {
      _id
      shopProductsIds
      shopProducts(input: $input) {
        totalPages
        docs {
          ...ShopProduct
        }
      }
    }
  }
  ${shopProductFragment}
`;
