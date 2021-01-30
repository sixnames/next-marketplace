import { gql } from '@apollo/client';

export const cmsProductAttributeFragment = gql`
  fragment CMSProductAttribute on ProductAttribute {
    attributeId
    attributesGroupId
    attributeSlug
    showInCard
    selectedOptionsSlugs
    attribute {
      _id
      slug
      name
      variant
      viewVariant
      metricId
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
    _id
    value
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
    productsIds
    attribute {
      _id
      name
    }
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
    rubricsIds
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
    showInCard
    showAsBreadcrumb
    attributeId
    attributeSlug
    attributesGroupId
    textI18n
    number
    selectedOptionsSlugs
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

export const productAttributesGroupASTFragment = gql`
  fragment ProductAttributesGroupAst on ProductAttributesGroupAst {
    _id
    name
    astAttributes {
      ...ProductAttributeAst
    }
  }
  ${productAttributeASTFragment}
`;

export const PRODUCT_ATTRIBUTES_AST_QUERY = gql`
  query GetProductAttributesAST($input: ProductAttributesASTInput!) {
    getProductAttributesAST(input: $input) {
      ...ProductAttributesGroupAst
    }
  }
  ${productAttributesGroupASTFragment}
`;

export const brandCollectionsOptionFragment = gql`
  fragment BrandCollectionsOption on BrandCollection {
    _id
    slug
    name
  }
`;

export const BRANDS_OPTIONS_QUERY = gql`
  query GetProductBrandsOptions {
    getBrandsOptions {
      _id
      slug
      name
      collectionsList {
        ...BrandCollectionsOption
      }
    }
    getManufacturersOptions {
      _id
      slug
      name
    }
  }
  ${brandCollectionsOptionFragment}
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
