import { gql } from '@apollo/client';

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
      product {
        id
        itemId
        name
        cardName
        slug
        price
        description
        rubrics
        #        assets {
        #          url
        #          width
        #          height
        #        }
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
  }
`;
