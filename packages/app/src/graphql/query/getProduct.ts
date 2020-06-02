import { gql } from '@apollo/client';

export const PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      itemId
      name
      cardName
      slug
      price
      description
      #      assets {
      #        url
      #        width
      #        height
      #      }
      rubrics
      attributesSource
      attributesGroups {
        showInCard
        source {
          id
          name
        }
        attributes {
          showInCard
          source {
            id
            name
            slug
            type
            metric {
              id
              name
            }
            options {
              id
              name
              options {
                id
                name
                color
              }
            }
          }
          value
        }
      }
    }
  }
`;
