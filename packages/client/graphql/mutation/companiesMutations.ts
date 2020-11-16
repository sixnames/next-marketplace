import { gql } from '@apollo/client';

export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateComany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      success
      message
    }
  }
`;
