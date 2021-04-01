import { gql } from '@apollo/client';
import { productSnippedFragment } from './catalogueQueries';

export const searchRubricFragment = gql`
  fragment SearchRubric on Rubric {
    _id
    name
    slug
  }
`;

export const CATALOGUE_SEARCH_TOP_ITEMS_QUERY = gql`
  query GetCatalogueSearchTopItems {
    getCatalogueSearchTopItems {
      rubrics {
        ...SearchRubric
      }
      products {
        ...ProductSnippet
      }
    }
  }
  ${searchRubricFragment}
  ${productSnippedFragment}
`;

export const CATALOGUE_SEARCH_RESULT_QUERY = gql`
  query GetCatalogueSearchResult($search: String!) {
    getCatalogueSearchResult(search: $search) {
      rubrics {
        ...SearchRubric
      }
      products {
        ...ProductSnippet
      }
    }
  }
  ${searchRubricFragment}
  ${productSnippedFragment}
`;
