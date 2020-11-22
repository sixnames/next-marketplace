import { gql } from '@apollo/client';
import { userInListFragment } from './usersQueries';

export const companyInListFragment = gql`
  fragment CompanyInList on Company {
    id
    itemId
    slug
    nameString
    owner {
      id
      fullName
    }
    logo {
      url
    }
  }
`;

export const COMPANIES_LIST_QUERY = gql`
  query GetAllCompanies($input: CompanyPaginateInput) {
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
    id
    itemId
    slug
    nameString
    city {
      id
      nameString
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
    id
    itemId
    slug
    nameString
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
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      ...Company
    }
  }
  ${companyFragment}
`;

export const COMPANY_SHOPS_QUERY = gql`
  query GetCompanyShops($companyId: ID!, $input: ShopPaginateInput) {
    getCompany(id: $companyId) {
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
  query GetAllShops($input: ShopPaginateInput) {
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
    id
    itemId
    nameString
    mainImage
  }
`;

export const shopProductFragment = gql`
  fragment ShopProduct on ShopProduct {
    id
    itemId
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
    id
    itemId
    nameString
    contacts {
      emails
      phones
    }
    city {
      id
      nameString
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
  query GetShop($id: ID!) {
    getShop(id: $id) {
      ...Shop
    }
  }
  ${shopFragment}
`;

export const SHOP_PRODUCTS_QUERY = gql`
  query GetShopProducts($shopId: ID!, $input: ShopProductPaginateInput) {
    getShop(id: $shopId) {
      products(input: $input) {
        totalPages
        docs {
          ...ShopProduct
        }
      }
    }
  }
  ${shopProductFragment}
`;
