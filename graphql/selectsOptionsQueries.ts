import { gql } from '@apollo/client';

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
