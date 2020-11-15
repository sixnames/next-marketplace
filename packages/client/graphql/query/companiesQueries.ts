import { gql } from '@apollo/client';

export const companyInListFragment = gql`
  fragment CompanyInList on Company {
    id
    itemId
    slug
    nameString
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
