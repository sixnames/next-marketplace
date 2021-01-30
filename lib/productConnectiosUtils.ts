import { generateDefaultLangSlug } from 'lib/slugUtils';
import { AttributeModel, OptionModel, ProductModel, ProductConnectionModel } from 'db/dbModels';
import { getI18nLocaleValue } from 'lib/i18n';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_OPTIONS, COL_PRODUCT_CONNECTIONS } from 'db/collectionNames';
import { ObjectId } from 'mongodb';

export interface GetConnectionValuesFromProductInterface {
  product: ProductModel;
  attributeId: ObjectId;
  locale: string;
}

export interface GetConnectionValuesFromProductPayloadInterface {
  attributeSlug: string;
  attributeValue: string;
  optionName: string;
}

export const getConnectionValuesFromProduct = async ({
  product,
  attributeId,
  locale,
}: GetConnectionValuesFromProductInterface): Promise<GetConnectionValuesFromProductPayloadInterface> => {
  const attributeInProduct = product.attributes.find((attribute) => {
    return attribute.attributeId.equals(attributeId);
  });

  if (!attributeInProduct) {
    throw Error('Product attribute not found in getConnectionValuesFromProduct');
  }

  const db = await getDatabase();
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const attribute = await attributesCollection.findOne({
    _id: attributeInProduct.attributeId,
  });

  if (!attribute) {
    throw Error('Attribute not found in getConnectionValuesFromProduct');
  }

  const currentAttributeValue = attributeInProduct.selectedOptionsSlugs[0];

  if (!currentAttributeValue) {
    throw Error('Attribute value not found in getConnectionValuesFromProduct');
  }

  if (!attribute.optionsGroupId) {
    throw Error('Options group not found in getConnectionValuesFromProduct');
  }

  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);
  const option = await optionsCollection.findOne({
    _id: { $in: attribute.optionsIds },
    slug: { $in: [currentAttributeValue] },
  });
  if (!option) {
    throw Error('Option not found in getConnectionValuesFromProduct');
  }

  return {
    attributeSlug: attribute.slug,
    attributeValue: currentAttributeValue,
    optionName: getI18nLocaleValue(option.nameI18n, locale),
  };
};

export interface GenerateDefaultLangSlugWithConnectionsInterface {
  product: ProductModel;
  locale: string;
}

export interface GenerateDefaultLangSlugWithConnectionsPayloadInterface {
  slug: string;
}

export const createProductSlugWithConnections = async ({
  product,
  locale,
}: GenerateDefaultLangSlugWithConnectionsInterface): Promise<GenerateDefaultLangSlugWithConnectionsPayloadInterface> => {
  const initialSlug = generateDefaultLangSlug(product.nameI18n);

  const db = await getDatabase();
  const productsCollections = db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);
  const connections = await productsCollections
    .find({
      productsIds: {
        $in: [product._id],
      },
    })
    .toArray();

  const connectionsValues: GetConnectionValuesFromProductPayloadInterface[] = [];
  for await (const connection of connections) {
    connectionsValues.push(
      await getConnectionValuesFromProduct({
        product,
        locale,
        attributeId: connection.attributeId,
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
  connectionId: ObjectId;
}

export const checkIsAllConnectionOptionsUsed = async ({
  connectionId,
}: CheckUsedConnectionOptionsInterface): Promise<boolean> => {
  const db = await getDatabase();
  const productsCollections = db.collection<ProductConnectionModel>(COL_PRODUCT_CONNECTIONS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

  const connection = await productsCollections.findOne({ _id: connectionId });
  if (!connection) {
    throw Error('Connection not found in checkIsAllConnectionOptionsUsed');
  }

  const attribute = await attributesCollection.findOne({ _id: connection.attributeId });
  if (!attribute) {
    throw Error('Attribute not found in checkIsAllConnectionOptionsUsed');
  }

  if (!attribute.optionsGroupId) {
    throw Error('Options group not found in checkIsAllConnectionOptionsUsed');
  }

  return connection.productsIds.length === attribute.optionsIds.length;
};
