import { DocumentType } from '@typegoose/typegoose';
import { Product, ProductConnectionModel } from '../entities/Product';
import { Attribute, AttributeModel } from '../entities/Attribute';
import { generateDefaultLangSlug } from './slug';
import { OptionsGroupModel } from '../entities/OptionsGroup';
import { OptionModel } from '../entities/Option';
import getLangField from './translations/getLangField';
import { ATTRIBUTE_VARIANT_NUMBER, ATTRIBUTE_VARIANT_STRING } from '@yagu/config';

export interface GetSelectAttributeOptionsValueInterface {
  attribute: DocumentType<Attribute>;
  lang: string;
  productAttributeValues: string[];
}

export const getProductAttributeReadableValues = async ({
  attribute,
  productAttributeValues,
  lang,
}: GetSelectAttributeOptionsValueInterface): Promise<string[]> => {
  if (
    attribute.variant === ATTRIBUTE_VARIANT_STRING ||
    attribute.variant === ATTRIBUTE_VARIANT_NUMBER
  ) {
    return productAttributeValues;
  }

  const optionsGroup = await OptionsGroupModel.findById(attribute.optionsGroup);
  if (!optionsGroup) {
    throw Error('Options group not found in getSelectAttributeOptionsValue');
  }

  const options = await OptionModel.find({
    _id: { $in: optionsGroup.options },
    slug: { $in: productAttributeValues },
  });

  return options.map((option) => getLangField(option.name, lang));
};

export interface GetConnectionValuesFromProductInterface {
  product: DocumentType<Product>;
  attributeId: string;
  attributesGroupId: string;
  lang: string;
}

export interface GetConnectionValuesFromProductPayloadInterface {
  attributeSlug: string;
  attributeValue: string;
  optionName: string;
}

export const getConnectionValuesFromProduct = async ({
  product,
  attributeId,
  attributesGroupId,
  lang,
}: GetConnectionValuesFromProductInterface): Promise<
  GetConnectionValuesFromProductPayloadInterface
> => {
  const attributesGroupInProduct = product.attributesGroups.find(
    ({ node }) => node.toString() === attributesGroupId,
  );

  if (!attributesGroupInProduct) {
    throw Error('Attributes group not found in getConnectionValuesFromProduct');
  }

  const attributeInProduct = attributesGroupInProduct.attributes.find(
    ({ node }) => node.toString() === attributeId,
  );

  if (!attributeInProduct) {
    throw Error('Product attribute not found in getConnectionValuesFromProduct');
  }

  const attribute = await AttributeModel.findById(attributeInProduct.node);

  if (!attribute) {
    throw Error('Attribute not found in getConnectionValuesFromProduct');
  }

  const currentAttributeValue = attributeInProduct.value[0];

  if (!currentAttributeValue) {
    throw Error('Attribute value not found in getConnectionValuesFromProduct');
  }

  const optionsGroup = await OptionsGroupModel.findById(attribute.optionsGroup);
  if (!optionsGroup) {
    throw Error('Options group not found in checkIsAllConnectionOptionsUsed');
  }

  const optionsNames = await getProductAttributeReadableValues({
    attribute,
    productAttributeValues: [currentAttributeValue],
    lang,
  });

  return {
    attributeSlug: attribute.slug,
    attributeValue: currentAttributeValue,
    optionName: optionsNames[0],
  };
};

export interface GenerateDefaultLangSlugWithConnectionsInterface {
  product: DocumentType<Product>;
  lang: string;
}

export interface GenerateDefaultLangSlugWithConnectionsPayloadInterface {
  slug: string;
}

export const createProductSlugWithConnections = async ({
  product,
  lang,
}: GenerateDefaultLangSlugWithConnectionsInterface): Promise<
  GenerateDefaultLangSlugWithConnectionsPayloadInterface
> => {
  const initialSlug = generateDefaultLangSlug(product.cardName);
  const connections = await ProductConnectionModel.find({
    productsIds: {
      $in: [product.id],
    },
  });

  const connectionsValues: GetConnectionValuesFromProductPayloadInterface[] = [];
  for await (const connection of connections) {
    connectionsValues.push(
      await getConnectionValuesFromProduct({
        product,
        lang,
        attributeId: connection.attributeId,
        attributesGroupId: connection.attributesGroupId,
      }),
    );
  }

  const connectionsValuesAsStringArray: string[] = connectionsValues.map(
    ({ attributeSlug, attributeValue }) => `${attributeSlug}-${attributeValue}`,
  );

  const slug = [initialSlug, ...connectionsValuesAsStringArray].join('-');

  return {
    slug,
  };
};

interface CheckUsedConnectionOptionsInterface {
  connectionId: string;
}

export const checkIsAllConnectionOptionsUsed = async ({
  connectionId,
}: CheckUsedConnectionOptionsInterface): Promise<boolean> => {
  const connection = await ProductConnectionModel.findById(connectionId);
  if (!connection) {
    throw Error('Connection not found in checkIsAllConnectionOptionsUsed');
  }

  const attribute = await AttributeModel.findById(connection.attributeId);
  if (!attribute) {
    throw Error('Attribute not found in checkIsAllConnectionOptionsUsed');
  }

  const optionsGroup = await OptionsGroupModel.findById(attribute.optionsGroup);
  if (!optionsGroup) {
    throw Error('Options group not found in checkIsAllConnectionOptionsUsed');
  }

  return connection.productsIds.length === optionsGroup.options.length;
};
