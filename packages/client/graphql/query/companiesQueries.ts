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

export const companyShopFragment = gql`
  fragment ShopInList on Shop {
    id
    itemId
    slug
    nameString
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
    shops {
      totalPages
      docs {
        ...ShopInList
      }
    }
  }
  ${userInListFragment}
  ${companyShopFragment}
`;

export const COMPANY_QUERY = gql`
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
      ...Company
    }
  }
  ${companyFragment}
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
    products {
      totalPages
      docs {
        ...ShopProduct
      }
    }
    contacts {
      emails
      phones
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
  ${shopProductFragment}
`;

export const SHOP_QUERY = gql`
  query GetShop($id: ID!) {
    getShop(id: $id) {
      ...Shop
    }
  }
  ${shopFragment}
`;
