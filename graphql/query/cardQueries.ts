import { gql } from '@apollo/client';

export const cardFeatureFragment = gql`
  fragment CardFeature on ProductAttribute {
    _id
    showInCard
    text
    number
    attributeName
    attributeViewVariant
    readableValue
    selectedOptions {
      _id
      slug
      name
      icon
    }
  }
`;

export const cardConnectionProductFragment = gql`
  fragment CardConnectionProduct on Product {
    _id
    slug
  }
`;

export const cardConnectionItemFragment = gql`
  fragment CardConnectionItem on ProductConnectionItem {
    _id
    option {
      _id
      name
    }
    product {
      ...CardConnectionProduct
    }
  }
  ${cardConnectionProductFragment}
`;

export const cardConnectionFragment = gql`
  fragment CardConnection on ProductConnection {
    _id
    attributeName
    connectionProducts {
      ...CardConnectionItem
    }
  }
  ${cardConnectionItemFragment}
`;

export const shopSnippetFragment = gql`
  fragment ShopSnippet on Shop {
    _id
    name
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
    _id
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
    _id
    itemId
    name
    originalName
    slug
    mainImage
    description
    cardPrices {
      _id
      min
      max
    }
    shopsCount
    isCustomersChoice
    cardShopProducts {
      ...ShopProductSnippet
    }
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
    connections {
      ...CardConnection
    }
  }
  ${cardFeatureFragment}
  ${cardConnectionFragment}
  ${shopProductSnippetFragment}
`;

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCard($slug: [String!]!) {
    getProductCard(slug: $slug) {
      ...ProductCard
    }
  }
  ${productCardFragment}
`;

export const CATALOGUE_CARD_SHOPS_QUERY = gql`
  query GetCatalogueCardShops($input: GetProductShopsInput!) {
    getProductShops(input: $input) {
      ...ShopProductSnippet
    }
  }
  ${productCardFragment}
`;

export const CARD_COUNTERS_MUTATION = gql`
  mutation UpdateProductCounter($input: UpdateProductCounterInput!) {
    updateProductCounter(input: $input)
  }
  ${productCardFragment}
`;
