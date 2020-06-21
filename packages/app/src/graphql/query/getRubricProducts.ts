import gql from 'graphql-tag';

export const RUBRIC_PRODUCTS_QUERY = gql`
  query GetRubricProducts($id: ID!, $notInRubric: ID) {
    getRubric(id: $id) {
      id
      products(input: { notInRubric: $notInRubric }) {
        totalDocs
        page
        totalPages
        docs {
          id
          itemId
          name
          price
          slug
          mainImage
        }
      }
    }
  }
`;
