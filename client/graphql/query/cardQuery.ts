import gql from 'graphql-tag';

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCardQuery($id: ID!) {
    getProduct(id: $id) {
      id
      itemId
      name
      price
      slug
      mainImage
    }
  }
`;
