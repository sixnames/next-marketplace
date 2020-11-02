import { gql } from '@apollo/client';

export const productCardFragment = gql`
  fragment ProductCard on Product {
    id
    itemId
    nameString
    cardNameString
    price
    slug
    mainImage
    descriptionString
    cardFeatures {
      id
      nameString
      showInCard
      attributes {
        id
        nameString
        value
        showInCard
      }
    }
    cardConnections {
      id
      nameString
      products {
        id
        value
        product {
          id
          slug
        }
      }
    }
  }
`;

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCardQuery($slug: String!) {
    getProductCard(slug: $slug) {
      ...ProductCard
    }
  }
`;
