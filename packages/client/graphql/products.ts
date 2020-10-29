import { gql } from '@apollo/client';

export const cmsProductAttributeFragment = gql`
  fragment CMSProductAttribute on ProductAttribute {
    showInCard
    key
    node {
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
          nameString
          color
        }
      }
    }
    value
  }
`;

export const cmsProductAttributesGroupFragment = gql`
  fragment CMSProductAttributesGroup on ProductAttributesGroup {
    showInCard
    node {
      id
      nameString
    }
    attributes {
      ...CMSProductAttribute
    }
  }
  ${cmsProductAttributeFragment}
`;

export const cmsProductFieldsFragment = gql`
  fragment CMSProductFields on Product {
    id
    itemId
    name {
      key
      value
    }
    nameString
    cardName {
      key
      value
    }
    cardNameString
    slug
    price
    description {
      key
      value
    }
    descriptionString
    assets {
      url
      index
    }
    active
    mainImage
    rubrics
    attributesGroups {
      ...CMSProductAttributesGroup
    }
  }
  ${cmsProductAttributesGroupFragment}
`;

export const cmsProductConnectionItemFragment = gql`
  fragment CMSProductConnectionItem on ProductConnectionItem {
    optionName
    value
    node {
      ...CMSProductFields
    }
  }
  ${cmsProductFieldsFragment}
`;

export const cmsProductConnectionFragment = gql`
  fragment CMSProductConnection on ProductConnection {
    id
    attribute {
      id
      nameString
    }
    products {
      ...CMSProductConnectionItem
    }
  }
  ${cmsProductFieldsFragment}
  ${cmsProductConnectionItemFragment}
`;

export const cmsProductFragment = gql`
  fragment CMSProduct on Product {
    ...CMSProductFields
    connections {
      ...CMSProductConnection
    }
  }
  ${cmsProductFieldsFragment}
  ${cmsProductConnectionFragment}
`;

export const PRODUCT_QUERY = gql`
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      ...CMSProduct
    }
  }
  ${cmsProductFragment}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
      product {
        ...CMSProduct
      }
    }
  }
  ${cmsProductFragment}
`;

export const CREATE_PRODUCT_MUTATION = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id) {
      success
      message
    }
  }
`;

export const CREATE_PRODUCT_CONNECTION_MUTATION = gql`
  mutation CreateProductConnection($input: CreateProductConnectionInput!) {
    createProductConnection(input: $input) {
      success
      message
    }
  }
`;

export const ADD_PRODUCT_TO_CONNECTION_MUTATION = gql`
  mutation AddProductToConnection($input: AddProductToConnectionInput!) {
    addProductToConnection(input: $input) {
      success
      message
    }
  }
`;

export const DELETE_PRODUCT_FROM_CONNECTION_MUTATION = gql`
  mutation DeleteProductFromConnection($input: DeleteProductFromConnectionInput!) {
    deleteProductFromConnection(input: $input) {
      success
      message
    }
  }
`;
