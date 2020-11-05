import { gql } from '@apollo/client';

export const GET_GENDER_OPTIONS_QUERY = gql`
  query GetGenderOptions {
    getGenderOptions {
      id
      nameString
    }
  }
`;

export const ATTRIBUTE_VIEW_VARIANT_OPTIONS_QUERY = gql`
  query AttributeViewVariantOptions {
    getAttributeViewVariantsList {
      id
      nameString
    }
  }
`;

export const iconOptionFragment = gql`
  fragment IconOption on IconOption {
    id
    icon
    nameString
  }
`;

export const ICON_OPTIONS_QUERY = gql`
  query IconsOptions {
    getIconsList {
      ...IconOption
    }
  }
  ${iconOptionFragment}
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

export const featuresASTAttributeFragment = gql`
  fragment FeaturesASTAttribute on Attribute {
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
`;

export const featuresASTGroupFragment = gql`
  fragment FeaturesASTGroup on AttributesGroup {
    id
    nameString
    attributes {
      ...FeaturesASTAttribute
    }
  }
  ${featuresASTAttributeFragment}
`;

export const GET_FEATURES_AST_QUERY = gql`
  query GetFeaturesAST($selectedRubrics: [ID!]!) {
    getFeaturesAst(selectedRubrics: $selectedRubrics) {
      ...FeaturesASTGroup
    }
  }
  ${featuresASTGroupFragment}
`;
