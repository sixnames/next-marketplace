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

export const shopSnippetFragment = gql`
  fragment ShopSnippet on Shop {
    id
    nameString
    slug
    productsCount
    address {
      formattedAddress
      formattedCoordinates {
        lat
        lng
      }
    }
    contacts {
      formattedPhones {
        raw
        readable
      }
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

export const shopProductSnippetFragment = gql`
  fragment ShopProductSnippet on ShopProduct {
    id
    itemId
    available
    formattedPrice
    formattedOldPrice
    discountedPercent
    inCartCount
    shop {
      ...ShopSnippet
    }
  }
  ${shopSnippetFragment}
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
    shopsCount
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
      listFeaturesString
      ratingFeaturesValues
    }
    cardConnections {
      ...CardConnection
    }
  }
  ${cardFeatureFragment}
  ${cardConnectionFragment}
`;

export const CATALOGUE_CARD_SHOPS_QUERY = gql`
  query GetCatalogueCardShops($input: GetProductShopsInput!) {
    getProductShops(input: $input) {
      ...ShopProductSnippet
    }
  }
  ${productCardFragment}
`;

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCardQuery($slug: String!) {
    getProductCard(slug: $slug) {
      ...ProductCard
    }
  }
  ${productCardFragment}
`;
