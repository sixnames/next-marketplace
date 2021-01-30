import {
  AttributeModel,
  ObjectIdModel,
  OptionModel,
  ProductAttributeModel,
  ProductConnectionModel,
  ProductModel,
} from 'db/dbModels';
import { GetFieldLocaleType } from 'lib/sessionHelpers';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_OPTIONS, COL_PRODUCT_CONNECTIONS } from 'db/collectionNames';
import { FilterQuery, FindOneOptions } from 'mongodb';

type ProductAttributeValue = 'TEXT' | 'NUMBER' | 'OPTIONS';

export const PRODUCT_ATTRIBUTE_VALUE_TYPE_TEXT = 'TEXT' as ProductAttributeValue;
export const PRODUCT_ATTRIBUTE_VALUE_TYPE_NUMBER = 'NUMBER' as ProductAttributeValue;
export const PRODUCT_ATTRIBUTE_VALUE_TYPE_OPTIONS = 'OPTIONS' as ProductAttributeValue;

interface GetProductAttributeValuePayloadInterface {
  selectedOptionsSlugs?: string[] | null;
  text?: string | null;
  number?: number | null;
  valueType?: ProductAttributeValue | null;
  isText: boolean;
  isNumber: boolean;
  isOptions: boolean;
  value?: string[] | string | number | null;
  readableValue: string | null;
}

export async function getProductAttributeValue(
  productAttribute: ProductAttributeModel,
  getFieldLocale: GetFieldLocaleType,
): Promise<GetProductAttributeValuePayloadInterface> {
  const db = await getDatabase();
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

  let valueType;
  const selectedOptionsSlugs = productAttribute.selectedOptionsSlugs;
  const text = getFieldLocale(productAttribute.textI18n);
  const number = productAttribute.number;

  if (text) {
    valueType = PRODUCT_ATTRIBUTE_VALUE_TYPE_TEXT;
  }

  if (number) {
    valueType = PRODUCT_ATTRIBUTE_VALUE_TYPE_NUMBER;
  }

  const selectedOptionsSlugsValue =
    selectedOptionsSlugs && selectedOptionsSlugs.length > 0 ? selectedOptionsSlugs : null;
  if (selectedOptionsSlugsValue) {
    valueType = PRODUCT_ATTRIBUTE_VALUE_TYPE_OPTIONS;
  }

  const isText = valueType === PRODUCT_ATTRIBUTE_VALUE_TYPE_TEXT;
  const isNumber = valueType === PRODUCT_ATTRIBUTE_VALUE_TYPE_NUMBER;
  const isOptions = valueType === PRODUCT_ATTRIBUTE_VALUE_TYPE_OPTIONS;

  let readableValue = null;

  if (isText) {
    readableValue = text;
  }

  if (isNumber) {
    readableValue = number ? `${number}` : null;
  }

  if (isOptions) {
    const options = await optionsCollection.find({ slug: { $in: selectedOptionsSlugs } });
    const optionsNames: string[] = [];
    for await (const option of options) {
      const optionName = getFieldLocale(option.nameI18n);
      optionsNames.push(optionName);
    }
    readableValue = optionsNames.join(', ');
  }

  return {
    selectedOptionsSlugs,
    text,
    number,
    valueType,
    isText,
    isNumber,
    isOptions,
    value: text || number || selectedOptionsSlugs,
    readableValue,
  };
}

export async function getProductConnections(
  productId: ObjectIdModel,
): Promise<ProductConnectionModel[]> {
  const db = await getDatabase();
  const productsConnectionsCollection = db.collection<ProductConnectionModel>(
    COL_PRODUCT_CONNECTIONS,
  );
  const connections = await productsConnectionsCollection
    .find({
      productsIds: productId,
    })
    .toArray();
  return connections;
}

export async function getAttributesIdsInProductConnections(
  productId: ObjectIdModel,
): Promise<ObjectIdModel[]> {
  const connections = await getProductConnections(productId);
  const attributesIdsInConnections = connections.map(({ attributeId }) => attributeId);
  return attributesIdsInConnections;
}

interface GetAttributesListFromProductAttributesInterface {
  product: ProductModel;
  query?: FilterQuery<AttributeModel>[];
  options?: FindOneOptions<AttributeModel>;
}

export async function getAttributesListFromProductAttributes({
  product,
  query,
  options,
}: GetAttributesListFromProductAttributesInterface): Promise<AttributeModel[]> {
  const db = await getDatabase();
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

  const attributesIdsInConnections = await getAttributesIdsInProductConnections(product._id);
  const attributesIds = product.attributes.map(({ attributeId }) => attributeId);

  const additionalQuery = query ? query : [];
  const attributes = await attributesCollection
    .find(
      {
        $and: [
          { _id: { $in: attributesIds } },

          // Exclude attributes used in connections
          { _id: { $nin: attributesIdsInConnections } },

          ...additionalQuery,
        ],
      },
      options,
    )
    .toArray();
  return attributes;
}
