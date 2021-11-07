import { IMAGE_FALLBACK } from 'config/common';
import {
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_ATTRIBUTES,
  COL_PRODUCT_CARD_CONTENTS,
  COL_PRODUCTS,
} from 'db/collectionNames';
import { CreateProductInputInterface } from 'db/dao/product/createProduct';
import {
  ProductAssetsModel,
  ProductAttributeModel,
  ProductCardContentModel,
  ProductModel,
  ProductPayloadModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';
import { updateProductSchema } from 'validation/productSchema';

export interface CopyProductInputInterface extends CreateProductInputInterface {
  productId: string;
}

export async function copyProduct({
  input,
  context,
}: DaoPropsInterface<CopyProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productCardContentsCollection =
    db.collection<ProductCardContentModel>(COL_PRODUCT_CARD_CONTENTS);
  const productAttributesCollection = db.collection<ProductAttributeModel>(COL_PRODUCT_ATTRIBUTES);
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage(`products.create.error`),
  };

  try {
    await session.withTransaction(async () => {
      // check input
      if (!input) {
        await session.abortTransaction();
        return;
      }

      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'createProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // validate
      const validationSchema = await getResolverValidationSchema({
        context,
        schema: updateProductSchema,
      });
      await validationSchema.validate(input);
      const { productId, ...values } = input;

      // get source product
      const productObjectId = new ObjectId(productId);
      const sourceProduct = await productsCollection.findOne({ _id: productObjectId });
      if (!sourceProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.update.notFound`),
        };
        await session.abortTransaction();
        return;
      }

      // create product
      const itemId = await getNextItemId(COL_PRODUCTS);
      const newProductId = new ObjectId();
      const createdProductResult = await productsCollection.insertOne({
        ...sourceProduct,
        ...values,
        _id: newProductId,
        itemId,
        barcode: [],
        slug: itemId,
        originalName: values.originalName || '',
        mainImage: IMAGE_FALLBACK,
        rubricId: sourceProduct.rubricId,
        rubricSlug: sourceProduct.rubricSlug,
        active: true,
        selectedOptionsSlugs: sourceProduct.selectedOptionsSlugs,
        selectedAttributesIds: sourceProduct.selectedAttributesIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdProduct = await productsCollection.findOne({
        _id: createdProductResult.insertedId,
      });
      if (!createdProductResult.acknowledged || !createdProduct) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create product assets
      const createdAssetsResult = await productAssetsCollection.insertOne({
        productId: newProductId,
        productSlug: itemId,
        assets: [
          {
            index: 1,
            url: IMAGE_FALLBACK,
          },
        ],
      });
      if (!createdAssetsResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // get source product attributes
      const sourceProductAttributes = await productAttributesCollection
        .find({
          productId: sourceProduct._id,
        })
        .toArray();

      // create product attributes
      const createdProductAttributes: ProductAttributeModel[] = [];
      for await (const productAttribute of sourceProductAttributes) {
        createdProductAttributes.push({
          ...productAttribute,
          _id: new ObjectId(),
          productId: createdProduct._id,
          productSlug: createdProduct.slug,
        });
      }
      if (createdProductAttributes.length > 0) {
        const newAttributesResult = await productAttributesCollection.insertMany(
          createdProductAttributes,
        );
        if (!newAttributesResult.acknowledged) {
          mutationPayload = {
            success: false,
            message: await getApiMessage(`products.create.error`),
          };
          await session.abortTransaction();
          return;
        }
      }

      // get source product card contents
      const sourceCardContents = await productCardContentsCollection
        .find({
          productId: sourceProduct._id,
        })
        .toArray();

      // create product card contents
      const createdProductCardContents: ProductCardContentModel[] = [];
      for await (const productCardContent of sourceCardContents) {
        createdProductCardContents.push({
          ...productCardContent,
          _id: new ObjectId(),
          productId: createdProduct._id,
          productSlug: createdProduct.slug,
        });
      }
      if (createdProductCardContents.length > 0) {
        const newCardContentsResult = await productCardContentsCollection.insertMany(
          createdProductCardContents,
        );
        if (!newCardContentsResult.acknowledged) {
          mutationPayload = {
            success: false,
            message: await getApiMessage(`products.create.error`),
          };
          await session.abortTransaction();
          return;
        }
      }

      // create algolia object
      const algoliaResult = await saveAlgoliaObjects({
        indexName: `${process.env.ALG_INDEX_PRODUCTS}`,
        objects: [
          {
            _id: createdProduct._id.toHexString(),
            objectID: createdProduct._id.toHexString(),
            itemId: createdProduct.itemId,
            originalName: createdProduct.originalName,
            nameI18n: createdProduct.nameI18n,
            descriptionI18n: createdProduct.descriptionI18n,
            barcode: createdProduct.barcode,
          },
        ],
      });
      if (!algoliaResult) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.create.success'),
        payload: createdProduct,
      };
    });

    return mutationPayload;
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
