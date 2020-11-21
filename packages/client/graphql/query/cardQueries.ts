import { gql } from '@apollo/client';

export const cardFeatureFragment = gql`
  fragment CardFeature on ProductAttribute {
    showInCard
    viewVariant
    readableValue
    readableOptions {
      id
      nameString
      icon
    }
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

export const productCardShopNodeFragment = gql`
  fragment ProductCardShopNode on Shop {
    id
    nameString
    slug
    productsCount
    address {
      formattedAddress
      point {
        coordinates
      }
    }
    contacts {
      phones
    }
    assets {
      index
      url
    }
    logo {
      index
      url
    }
  }
`;

export const productCardShopFragment = gql`
  fragment ProductCardShop on ProductShop {
    id
    itemId
    available
    formattedPrice
    formattedOldPrice
    discountedPercent
    node {
      ...ProductCardShopNode
    }
  }
  ${productCardShopNodeFragment}
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
    cardPrices {
      min
      max
    }
    shops {
      ...ProductCardShop
    }
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
      ratingFeatures {
        ...CardFeature
      }
    }
    cardConnections {
      ...CardConnection
    }
  }
  ${productCardShopFragment}
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
