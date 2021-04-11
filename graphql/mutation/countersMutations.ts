import { gql } from '@apollo/client';

export const UPDATE_CATALOGUE_COUNTERS_MUTATION = gql`
  mutation UpdateCatalogueCounters($input: CatalogueDataInput!) {
    updateCatalogueCounters(input: $input)
  }
`;

export const CARD_COUNTERS_MUTATION = gql`
  mutation UpdateProductCounter($input: UpdateProductCounterInput!) {
    updateProductCounter(input: $input)
  }
`;
