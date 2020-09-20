import { gql } from '@apollo/client';

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCardQuery($slug: String!) {
    getProductCard(slug: $slug) {
      id
      itemId
      nameString
      cardNameString
      price
      slug
      mainImage
      descriptionString
      attributesGroups {
        showInCard
        node {
          id
          nameString
        }
        attributes {
          showInCard
          node {
            id
            nameString
            options {
              id
              nameString
              options {
                id
                nameString
              }
            }
          }
          value
        }
      }
    }
  }
`;
