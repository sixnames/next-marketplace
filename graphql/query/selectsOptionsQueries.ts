import { gql } from '@apollo/client';

export const selectOptionFragment = gql`
  fragment SelectOption on SelectOption {
    _id
    name
    icon
  }
`;

export const GET_GENDER_OPTIONS_QUERY = gql`
  query GetGenderOptions {
    getGenderOptions {
      ...SelectOption
    }
  }
  ${selectOptionFragment}
`;

export const ATTRIBUTE_VIEW_VARIANT_OPTIONS_QUERY = gql`
  query AttributeViewVariantOptions {
    getAttributeViewVariantsOptions {
      ...SelectOption
    }
  }
  ${selectOptionFragment}
`;

export const ICON_OPTIONS_QUERY = gql`
  query IconsOptions {
    getIconsOptions {
      ...SelectOption
    }
  }
  ${selectOptionFragment}
`;

export const OPTIONS_GROUP_VARIANTS_QUERY = gql`
  query OptionsGroupVariants {
    getOptionsGroupVariantsOptions {
      ...SelectOption
    }
  }
  ${selectOptionFragment}
`;

export const LANGUAGES_ISO__OPTIONS_QUERY = gql`
  query GetISOLanguagesList {
    getISOLanguagesOptions {
      ...SelectOption
    }
  }
  ${selectOptionFragment}
`;

export const NEW_ATTRIBUTE_OPTIONS_QUERY = gql`
  query GetNewAttributeOptions {
    getAllOptionsGroups {
      _id
      name
    }
    getAllMetricsOptions {
      _id
      name
    }
    getAttributeVariantsOptions {
      _id
      name
    }
    getAttributePositioningOptions {
      _id
      name
    }
    getAttributeViewVariantsOptions {
      ...SelectOption
    }
  }
  ${selectOptionFragment}
`;

export const BRAND_ALPHABET_OPTIONS_QUERY = gql`
  query GetBrandAlphabetLists($input: BrandAlphabetInput) {
    getBrandAlphabetLists(input: $input) {
      letter
      docs {
        _id
        slug
        name
      }
    }
  }
`;

export const BRAND_COLLECTION_ALPHABET_OPTIONS_QUERY = gql`
  query GetBrandCollectionAlphabetLists($input: BrandCollectionAlphabetInput) {
    getBrandCollectionAlphabetLists(input: $input) {
      letter
      docs {
        _id
        slug
        name
      }
    }
  }
`;

export const MANUFACTURER_ALPHABET_OPTIONS_QUERY = gql`
  query GetManufacturerAlphabetLists($input: ManufacturerAlphabetInput) {
    getManufacturerAlphabetLists(input: $input) {
      letter
      docs {
        _id
        slug
        name
      }
    }
  }
`;
