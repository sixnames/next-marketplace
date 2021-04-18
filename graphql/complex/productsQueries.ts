import { gql } from '@apollo/client';

export const cmsProductAttributeFragment = gql`
  fragment CMSProductAttribute on ProductAttribute {
    attributeId
    attributeSlug
    showInCard
    selectedOptionsSlugs
    attribute {
      _id
      slug
      name
      variant
      viewVariant
      metric {
        _id
        name
      }
      options {
        _id
        name
        color
      }
    }
  }
`;

export const cmSProductConnectionItemFragment = gql`
  fragment CmsProductConnectionItem on ProductConnectionItem {
    option {
      _id
      name
    }
    productId
    product {
      _id
      itemId
      active
      name
      slug
      mainImage
    }
  }
`;

export const cmSProductConnectionFragment = gql`
  fragment CmsProductConnection on ProductConnection {
    _id
    attributeId
    attributeName
    connectionProducts {
      ...CmsProductConnectionItem
    }
  }
  ${cmSProductConnectionItemFragment}
`;

export const cmsProductFieldsFragment = gql`
  fragment CMSProductFields on Product {
    _id
    itemId
    nameI18n
    name
    originalName
    slug
    descriptionI18n
    description
    assets {
      url
      index
    }
    active
    mainImage
    rubricId
    rubric {
      _id
      slug
      name
    }
    brandSlug
    brandCollectionSlug
    manufacturerSlug
    attributes {
      ...CMSProductAttribute
    }
    connections {
      ...CmsProductConnection
    }
  }
  ${cmSProductConnectionFragment}
  ${cmsProductAttributeFragment}
`;

export const cmsProductFragment = gql`
  fragment CMSProduct on Product {
    ...CMSProductFields
  }
  ${cmsProductFieldsFragment}
`;

export const PRODUCT_QUERY = gql`
  query GetProduct($_id: ObjectId!) {
    getProduct(_id: $_id) {
      ...CMSProduct
    }
  }
  ${cmsProductFragment}
`;

export const productAttributeASTFragment = gql`
  fragment ProductAttributeAst on ProductAttribute {
    _id
    showInCard
    showAsBreadcrumb
    attributeId
    attributeSlug
    textI18n
    number
    selectedOptionsSlugs
    attributeName
    attributeNameI18n
    attributeSlug
    attributeVariant
    attributeViewVariant
    attribute {
      _id
      name
      variant
      metric {
        _id
        name
      }
      options {
        _id
        slug
        name
      }
    }
  }
`;

export const PRODUCT_ATTRIBUTES_AST_QUERY = gql`
  query GetProductAttributesAST($input: ProductAttributesASTInput!) {
    getProductAttributesAST(input: $input) {
      ...ProductAttributeAst
    }
  }
  ${productAttributeASTFragment}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      success
      message
      payload {
        ...CMSProduct
      }
    }
  }
  ${cmsProductFragment}
`;

export const UPDATE_PRODUCT_ASSETS_MUTATION = gql`
  mutation AddProductAssets($input: AddProductAssetsInput!) {
    addProductAssets(input: $input) {
      success
      message
      payload {
        ...CMSProduct
      }
    }
  }
  ${cmsProductFragment}
`;

export const DELETE_PRODUCT_ASSET_MUTATION = gql`
  mutation DeleteProductAsset($input: DeleteProductAssetInput!) {
    deleteProductAsset(input: $input) {
      success
      message
      payload {
        ...CMSProduct
      }
    }
  }
  ${cmsProductFragment}
`;

export const UPDATE_PRODUCT_ASSET_INDEX_MUTATION = gql`
  mutation UpdateProductAssetIndex($input: UpdateProductAssetIndexInput!) {
    updateProductAssetIndex(input: $input) {
      success
      message
      payload {
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
      payload {
        _id
      }
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
