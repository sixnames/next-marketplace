import { AttributeModel, ObjectIdModel, ProductConnectionModel, ProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { COL_ATTRIBUTES, COL_PRODUCT_CONNECTIONS } from 'db/collectionNames';
import { FilterQuery, FindOneOptions } from 'mongodb';

type ProductAttributeValue = 'TEXT' | 'NUMBER' | 'OPTIONS';

export const PRODUCT_ATTRIBUTE_VALUE_TYPE_TEXT = 'TEXT' as ProductAttributeValue;
export const PRODUCT_ATTRIBUTE_VALUE_TYPE_NUMBER = 'NUMBER' as ProductAttributeValue;
export const PRODUCT_ATTRIBUTE_VALUE_TYPE_OPTIONS = 'OPTIONS' as ProductAttributeValue;

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
