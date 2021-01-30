import { gql } from '@apollo/client';

export const cardFeatureFragment = gql`
  fragment CardFeature on ProductAttribute {
    showInCard
    attribute {
      _id
      name
      viewVariant
    }
    text
    number
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
    itemId
    slug
    name
    active
    mainImage
  }
`;

export const cardConnectionItemFragment = gql`
  fragment CardConnectionItem on ProductCardConnectionItem {
    _id
    value
    isCurrent
    product {
      ...CardConnectionProduct
    }
  }
  ${cardConnectionProductFragment}
`;

export const cardConnectionFragment = gql`
  fragment CardConnection on ProductCardConnection {
    _id
    name
    productsIds
    attributeId
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
      min
      max
    }
    shopsCount
    cardShopProducts {
      ...ShopProductSnippet
    }
    snippetFeatures {
      listFeaturesString
      ratingFeaturesValues
    }
    cardFeatures {
      _id
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
  ${cardFeatureFragment}
  ${cardConnectionFragment}
  ${shopProductSnippetFragment}
`;

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCard($slug: [String!]!) {
    getProductCard(slug: $slug) {
      ...ProductCard
      cardBreadcrumbs(slug: $slug) {
        _id
        name
        href
      }
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
