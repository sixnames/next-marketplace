import { DocumentType } from '@typegoose/typegoose';
import { Product, ProductConnectionModel } from '../entities/Product';
import { AttributeModel } from '../entities/Attribute';
import { generateDefaultLangSlug } from './slug';
import { OptionsGroupModel } from '../entities/OptionsGroup';

export interface getConnectionValuesFromProductInterface {
  product: DocumentType<Product>;
  attributeId: string;
  attributesGroupId: string;
}

export interface getConnectionValuesFromProductPayloadInterface {
  attributeSlug: string;
  attributeValue: string;
}

export const getConnectionValuesFromProduct = async ({
  product,
  attributeId,
  attributesGroupId,
}: getConnectionValuesFromProductInterface): Promise<
  getConnectionValuesFromProductPayloadInterface
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

  return {
    attributeSlug: attribute.slug,
    attributeValue: currentAttributeValue,
  };
};

export interface GenerateDefaultLangSlugWithConnectionsInterface {
  product: DocumentType<Product>;
}

export interface GenerateDefaultLangSlugWithConnectionsPayloadInterface {
  slug: string;
}

export const createProductSlugWithConnections = async ({
  product,
}: GenerateDefaultLangSlugWithConnectionsInterface): Promise<
  GenerateDefaultLangSlugWithConnectionsPayloadInterface
> => {
  const initialSlug = generateDefaultLangSlug(product.cardName);
  const connections = await ProductConnectionModel.find({
    productsIds: {
      $in: [product.id],
    },
  });

  const connectionsValues: getConnectionValuesFromProductPayloadInterface[] = [];
  for await (const connection of connections) {
    connectionsValues.push(
      await getConnectionValuesFromProduct({
        product,
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

  const optionsGroup = await OptionsGroupModel.findById(attribute.options);
  if (!optionsGroup) {
    throw Error('Options group not found in checkIsAllConnectionOptionsUsed');
  }

  return connection.productsIds.length === optionsGroup.options.length;
};
