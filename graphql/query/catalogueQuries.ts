import { gql } from '@apollo/client';

export const CATALOGUE_ADDITIONAL_OPTIONS_QUERY = gql`
  query GetCatalogueAdditionalOptions($input: CatalogueAdditionalOptionsInput!) {
    getCatalogueAdditionalOptions(input: $input) {
      letter
      docs {
        _id
        name
        slug
      }
    }
  }
`;
