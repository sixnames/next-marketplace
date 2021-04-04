import { gql } from '@apollo/client';

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

export const CATALOGUE_CARD_SHOPS_QUERY = gql`
  query GetCatalogueCardShops($input: GetProductShopsInput!) {
    getProductShops(input: $input) {
      ...ShopProductSnippet
    }
  }
  ${shopProductSnippetFragment}
`;

export const CARD_COUNTERS_MUTATION = gql`
  mutation UpdateProductCounter($input: UpdateProductCounterInput!) {
    updateProductCounter(input: $input)
  }
`;
