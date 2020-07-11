import gql from 'graphql-tag';

const productFragment = gql`
  fragment ProductFragment on Product {
    id
    itemId
    name
    cardName
    slug
    price
    description
    assets {
      url
      index
    }
    rubrics
    attributesGroups {
      showInCard
      node {
        id
        nameString
      }
      attributes {
        showInCard
        key
        node {
          id
          slug
          nameString
          variant
          metric {
            id
            nameString
          }
          options {
            id
            nameString
            options {
              id
              nameString
              color
            }
          }
        }
        value
      }
    }
  }
`;

export const PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      ...ProductFragment
    }
  }
  ${productFragment}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
      product {
        ...ProductFragment
      }
    }
  }
  ${productFragment}
`;
