import { gql } from '@apollo/client';
import { catalogueRubricFragment, productSnippedFragment } from './catalogueQueries';

export const CATALOGUE_SEARCH_TOP_ITEMS_QUERY = gql`
  query GetCatalogueSearchTopItems {
    getCatalogueSearchTopItems {
      rubrics {
        ...CatalogueRubric
      }
      products {
        ...ProductSnippet
      }
    }
  }
  ${catalogueRubricFragment}
  ${productSnippedFragment}
`;

export const CATALOGUE_SEARCH_RESULT_QUERY = gql`
  query GetCatalogueSearchResult($search: String!) {
    getCatalogueSearchResult(search: $search) {
      rubrics {
        ...CatalogueRubric
      }
      products {
        ...ProductSnippet
      }
    }
  }
  ${catalogueRubricFragment}
  ${productSnippedFragment}
`;
