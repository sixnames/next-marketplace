import gql from 'graphql-tag';

export const NEW_ATTRIBUTE_OPTIONS_QUERY = gql`
  query GetNewAttributeOptions {
    getAllOptionsGroups {
      id
      nameString
    }
    getAllMetrics {
      id
      nameString
    }
    getAttributeVariants {
      id
      nameString
    }
  }
`;
