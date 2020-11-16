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
