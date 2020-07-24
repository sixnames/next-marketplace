import gql from 'graphql-tag';

export const CATALOGUE_CARD_QUERY = gql`
  query GetCatalogueCardQuery($slug: String!) {
    getProductBySlug(slug: $slug) {
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
