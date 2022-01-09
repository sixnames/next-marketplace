import { ObjectId } from 'mongodb';
import { DEFAULT_LOCALE, IMAGE_FALLBACK } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getNextItemId } from '../../../lib/itemIdUtils';
import { checkBarcodeIntersects, trimProductName } from '../../../lib/productUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { execUpdateProductTitles } from '../../../lib/updateProductTitles';
import {
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_RUBRIC_VARIANTS,
  COL_RUBRICS,
} from '../../collectionNames';
import {
  GenderModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  RubricModel,
  RubricVariantModel,
  TranslationModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface CreateProductInputInterface {
  active: boolean;
  barcode: string[];
  originalName: string;
  nameI18n?: TranslationModel | null;
  descriptionI18n?: TranslationModel | null;
  rubricId: string;
  gender: GenderModel;
}

export async function createProduct({
  context,
  input,
}: DaoPropsInterface<CreateProductInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const rubricsCollection = db.collection<RubricModel>(COL_RUBRICS);
  const rubricVariantCollection = db.collection<RubricVariantModel>(COL_RUBRIC_VARIANTS);

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

      const { rubricId, ...values } = input;
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

      // get rubric variant
      const rubricVariant = await rubricVariantCollection.findOne({
        _id: rubric.variantId,
      });
      if (!rubricVariant) {
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
      const itemId = await getNextItemId(COL_PRODUCT_SUMMARIES);
      const productId = new ObjectId();
      const { originalName, nameI18n } = trimProductName({
        nameI18n: values.nameI18n,
        originalName: values.originalName,
      });
      const createdSummaryResult = await productSummariesCollection.insertOne({
        ...values,
        _id: productId,
        itemId,
        mainImage: IMAGE_FALLBACK,
        assets: [IMAGE_FALLBACK],
        barcode: [],
        attributes: [],
        slug: itemId,
        nameI18n,
        snippetTitleI18n: {
          [DEFAULT_LOCALE]: originalName,
        },
        cardTitleI18n: {
          [DEFAULT_LOCALE]: originalName,
        },
        originalName,
        rubricId: rubric._id,
        rubricSlug: rubric.slug,
        allowDelivery: Boolean(rubricVariant.allowDelivery),
        active: false,
        titleCategorySlugs: [],
        filterSlugs: [],
        attributeIds: [],
        variants: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      const createdSummary = await productSummariesCollection.findOne({
        _id: createdSummaryResult.insertedId,
      });
      if (!createdSummaryResult.acknowledged || !createdSummary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create product facet
      const createdProductFacetResult = await productFacetsCollection.insertOne({
        _id: createdSummary._id,
        itemId: createdSummary.itemId,
        slug: createdSummary.slug,
        barcode: createdSummary.barcode,
        rubricSlug: createdSummary.rubricSlug,
        rubricId: createdSummary.rubricId,
        manufacturerSlug: createdSummary.manufacturerSlug,
        brandSlug: createdSummary.brandSlug,
        brandCollectionSlug: createdSummary.brandCollectionSlug,
        filterSlugs: createdSummary.filterSlugs,
        attributeIds: createdSummary.attributeIds,
        allowDelivery: createdSummary.allowDelivery,
        active: createdSummary.active,
        mainImage: createdSummary.mainImage,
      });
      if (!createdProductFacetResult.acknowledged) {
        mutationPayload = {
          success: false,
          message: await getApiMessage(`products.create.error`),
        };
        await session.abortTransaction();
        return;
      }

      // create algolia object
      execUpdateProductTitles(`productId=${createdSummary._id.toHexString()}`);

      mutationPayload = {
        success: true,
        message: await getApiMessage('products.create.success'),
        payload: createdSummary,
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
