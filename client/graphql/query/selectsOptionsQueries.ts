import gql from 'graphql-tag';

export const GET_GENDER_OPTIONS_QUERY = gql`
  query GetGenderOptions {
    getGenderOptions {
      id
      nameString
    }
  }
`;

export const LANGUAGES_ISO__OPTIONS_QUERY = gql`
  query GetISOLanguagesList {
    getISOLanguagesList {
      id
      nameString
      nativeName
    }
  }
`;

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
    getAttributePositioningOptions {
      id
      nameString
    }
  }
`;

export const GET_FEATURES_AST_QUERY = gql`
  query GetFeaturesAST($selectedRubrics: [ID!]!) {
    getFeaturesAst(selectedRubrics: $selectedRubrics) {
      id
      nameString
      attributes {
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
            slug
            nameString
            color
          }
        }
      }
    }
  }
`;
