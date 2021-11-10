import { IMAGE_FALLBACK } from 'config/common';
import {
  COL_PRODUCT_ASSETS,
  COL_PRODUCT_CARD_DESCRIPTIONS,
  COL_PRODUCTS,
  COL_RUBRICS,
} from 'db/collectionNames';
import {
  GenderModel,
  Maybe,
  ProductAssetsModel,
  ProductCardDescriptionModel,
  ProductModel,
  ProductPayloadModel,
  RubricModel,
  TranslationModel,
} from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { saveAlgoliaObjects } from 'lib/algoliaUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getNextItemId } from 'lib/itemIdUtils';
import { checkBarcodeIntersects, trimProductName } from 'lib/productUtils';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { checkProductDescriptionUniqueness } from 'lib/textUniquenessUtils';
import { ObjectId } from 'mongodb';

export interface CreateProductInputInterface {
  companySlug: string;
  active: boolean;
  barcode: string[];
  originalName: string;
  nameI18n: Maybe<TranslationModel>;
  descriptionI18n: Maybe<TranslationModel>;
  cardDescriptionI18n: Maybe<TranslationModel>;
  rubricId: string;
  gender: GenderModel;
}

export async function createProduct({
  context,
  input,
}: DaoPropsInterface<CreateProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);
  const productAssetsCollection = db.collection<ProductAssetsModel>(COL_PRODUCT_ASSETS);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const productsCardDescriptionsCollection = db.collection<ProductCardDescriptionModel>(
    COL_PRODUCT_CARD_DESCRIPTIONS,
  );

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

      const { rubricId, cardDescriptionI18n, companySlug, ...values } = input;
      const rubricObjectId = new ObjectId(rubricId);

      // get selected rubric
      const rubric = await rubricsCollection.findOne({ _id: rubricObjectId });
      if (!rubric) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // check barcode intersects
      const barcodeDoubles = await checkBarcodeIntersects({
        locale,
        barcode: values.barcode,
        productId: null,
      });
      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
      }

      // create product
      const itemId = await getNextItemId(COL_PRODUCTS);
      const productId = new ObjectId();
      const { originalName, nameI18n } = trimProductName({
        nameI18n: values.nameI18n,
        originalName: values.originalName,
      });
      const createdProductResult = await productsCollection.insertOne({
        ...values,
        _id: productId,
        itemId,
        mainImage: IMAGE_FALLBACK,
        slug: itemId,
        nameI18n,
        originalName,
        rubricId: rubric._id,
        rubricSlug: rubric.slug,
        active: false,
        titleCategoriesSlugs: [],
        selectedOptionsSlugs: [],
        selectedAttributesIds: [],
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
        productId,
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

      // create card description
      const createdCardDescription = await productsCardDescriptionsCollection.insertOne({
        productSlug: itemId,
        productId,
        textI18n: cardDescriptionI18n || {},
        companySlug,
      });
      if (!createdCardDescription.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
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

      // check description uniqueness
      await checkProductDescriptionUniqueness({
        product: createdProduct,
        cardDescriptionI18n: cardDescriptionI18n,
        companySlug,
      });

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
