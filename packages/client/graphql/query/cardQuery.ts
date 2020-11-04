import { gql } from '@apollo/client';

export const cardFeatureFragment = gql`
  fragment CardFeature on ProductAttribute {
    showInCard
    viewVariant
    readableValue
    node {
      id
      nameString
    }
  }
`;

export const cardConnectionFragment = gql`
  fragment CardConnection on ProductCardConnection {
    id
    nameString
    products {
      id
      value
      isCurrent
      product {
        id
        slug
      }
    }
  }
`;

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
      listFeatures {
        ...CardFeature
      }
      textFeatures {
        ...CardFeature
      }
      tagFeatures {
        ...CardFeature
      }
      iconFeatures {
        ...CardFeature
      }
    }
    cardConnections {
      ...CardConnection
    }
  }
  ${cardFeatureFragment}
  ${cardConnectionFragment}
`;

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCardQuery($slug: String!) {
    getProductCard(slug: $slug) {
      ...ProductCard
    }
  }
  ${productCardFragment}
`;
