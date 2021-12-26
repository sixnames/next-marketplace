import { gql } from '@apollo/client';

export const selectOptionFragment = gql`
  fragment SelectOption on SelectOption {
    _id
    name
    icon
  }
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
  }
  ${selectOptionFragment}
`;

export const BRAND_ALPHABET_OPTIONS_QUERY = gql`
  query GetBrandAlphabetLists($input: BrandAlphabetInput) {
    getBrandAlphabetLists(input: $input) {
      letter
      docs {
        _id
        itemId
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
        itemId
        name
      }
    }
  }
`;

export const CATEGORY_ALPHABET_OPTIONS_QUERY = gql`
  query GetCategoriesAlphabetLists($input: CategoryAlphabetInput) {
    getCategoriesAlphabetLists(input: $input) {
      letter
      docs {
        _id
        slug
        name
        categories {
          _id
          slug
          name
          categories {
            _id
            slug
            name
            categories {
              _id
              slug
              name
              categories {
                _id
                slug
                name
                categories {
                  _id
                  slug
                  name
                }
              }
            }
          }
        }
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
        itemId
        name
      }
    }
  }
`;

export const SUPPLIER_ALPHABET_OPTIONS_QUERY = gql`
  query GetSupplierAlphabetLists($input: SupplierAlphabetInput) {
    getSupplierAlphabetLists(input: $input) {
      letter
      docs {
        _id
        itemId
        name
      }
    }
  }
`;

export const OPTIONS_ALPHABET_QUERY = gql`
  query GetOptionAlphabetLists($input: OptionAlphabetInput!) {
    getOptionAlphabetLists(input: $input) {
      letter
      docs {
        _id
        name
        slug
        options {
          _id
          name
          slug
          options {
            _id
            name
            slug
            options {
              _id
              name
              slug
              options {
                _id
                name
                slug
              }
            }
          }
        }
      }
    }
  }
`;

export const CITIES_LIST_QUERY = gql`
  query GetSessionCities {
    getSessionCities {
      _id
      slug
      name
    }
  }
`;

export const OPTION_GROUPS_LIST_QUERY = gql`
  query GetAllOptionsGroups($excludedIds: [ObjectId!]) {
    getAllOptionsGroups(excludedIds: $excludedIds) {
      _id
      name
    }
  }
`;
