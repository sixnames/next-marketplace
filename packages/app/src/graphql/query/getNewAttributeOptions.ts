import { gql } from '@apollo/client';

export const NEW_ATTRIBUTE_OPTIONS_QUERY = gql`
  query GetNewAttributeOptions {
    getAllOptionsGroups {
      id
      name
    }
    getAllMetrics {
      id
      name
    }
    getAttributeTypes {
      id
      name
    }
  }
`;
