import { ObjectId } from 'mongodb';
import { FILTER_SEPARATOR } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from '../../../lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { getParentTreeIds } from '../../../lib/treeUtils';
import { execUpdateProductTitles } from '../../../lib/updateProductTitles';
import {
  COL_ATTRIBUTES,
  COL_OPTIONS,
  COL_PRODUCT_FACETS,
  COL_PRODUCT_SUMMARIES,
  COL_SHOP_PRODUCTS,
} from '../../collectionNames';
import {
  AttributeModel,
  ObjectIdModel,
  OptionModel,
  ProductFacetModel,
  ProductPayloadModel,
  ProductSummaryModel,
  ShopProductModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateProductSelectAttributeInputInterface {
  productId: string;
  productAttributeId: string;
  attributeId: string;
  selectedOptionsIds: string[];
}

export async function updateProductSelectAttribute({
  context,
  input,
}: DaoPropsInterface<UpdateProductSelectAttributeInputInterface>): Promise<ProductPayloadModel> {
  const { getApiMessage } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
  const productFacetsCollection = db.collection<ProductFacetModel>(COL_PRODUCT_FACETS);
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);
  const optionsCollection = db.collection<OptionModel>(COL_OPTIONS);

  const session = client.startSession();

  let mutationPayload: ProductPayloadModel = {
    success: false,
    message: await getApiMessage('products.update.error'),
  };

  try {
    await session.withTransaction(async () => {
      // permission
      const { allow, message } = await getOperationPermission({
        context,
        slug: 'updateProduct',
      });
      if (!allow) {
        mutationPayload = {
          success: false,
          message,
        };
        await session.abortTransaction();
        return;
      }

      // check input
      if (!input) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      const selectedOptionsIds = input.selectedOptionsIds.map((_id) => new ObjectId(_id));
      const productId = new ObjectId(input.productId);
      const attributeId = new ObjectId(input.attributeId);
      const productAttributeId = new ObjectId(input.productAttributeId);

      // Check if product exist
      const summary = await productSummariesCollection.findOne({ _id: productId });
      if (!summary) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      // Check if product attribute exist
      let productAttribute = summary.attributes.find((productAttribute) => {
        return productAttribute.attributeId.equals(attributeId);
      });

      // Check attribute availability
      const attribute = await attributesCollection.findOne({ _id: attributeId });
      if (!attribute) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      const productAttributeNotExist = !productAttribute;

      // Create new product attribute if original is absent
      if (!productAttribute) {
        productAttribute = {
          _id: productAttributeId,
          attributeId,
          optionIds: [],
          filterSlugs: [],
          number: undefined,
          textI18n: {},
          readableValueI18n: {},
        };
      }

      // Get selected options tree
      const finalOptionIds: ObjectIdModel[] = [];
      for await (const optionId of selectedOptionsIds) {
        const optionsTreeIds = await getParentTreeIds({
          collectionName: COL_OPTIONS,
          _id: optionId,
          acc: [],
        });
        optionsTreeIds.forEach((_id) => finalOptionIds.push(_id));
      }
      const finalOptions = await optionsCollection
        .find({
          _id: {
            $in: finalOptionIds,
          },
        })
        .toArray();

      // Update or create product attribute
      const finalFilterSlugs = finalOptions.map(
        ({ slug }) => `${attribute.slug}${FILTER_SEPARATOR}${slug}`,
      );

      const oldFilterSlugs = [...productAttribute.filterSlugs];

      const readableValueI18n = getAttributeReadableValueLocales({
        productAttribute: {
          ...productAttribute,
          attribute: {
            ...attribute,
            options: finalOptions,
          },
        },
        gender: summary.gender,
      });
      productAttribute.readableValueI18n = readableValueI18n;

      // add new product attribute if not exist
      if (productAttributeNotExist && finalOptionIds.length > 0) {
        const updatedSummaryResult = await productSummariesCollection.findOneAndUpdate(
          {
            _id: summary._id,
          },
          {
            $push: {
              attributes: {
                ...productAttribute,
                optionIds: finalOptionIds,
                filterSlugs: finalFilterSlugs,
              },
            },
            $addToSet: {
              attributeIds: attributeId,
              filterSlugs: {
                $each: finalFilterSlugs,
              },
            },
          },
        );
        if (!updatedSummaryResult.ok) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('products.update.error'),
          };
          await session.abortTransaction();
          return;
        }

        await shopProductsCollection.updateMany(
          {
            productId: summary._id,
          },
          {
            $addToSet: {
              filterSlugs: {
                $each: finalFilterSlugs,
              },
            },
          },
        );
        await productFacetsCollection.findOneAndUpdate(
          {
            _id: summary._id,
          },
          {
            $addToSet: {
              attributeIds: attributeId,
              filterSlugs: {
                $each: finalFilterSlugs,
              },
            },
          },
        );

        // update product title
        execUpdateProductTitles(`productId=${summary._id.toHexString()}`);

        mutationPayload = {
          success: true,
          message: await getApiMessage('products.update.success'),
        };
        return;
      }

      // remove attribute if value is empty
      if (finalOptionIds.length < 1) {
        const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
          {
            _id: summary._id,
          },
          {
            $pull: {
              attributeIds: attributeId,
              attributes: {
                attributeId,
              },
            },
            $pullAll: {
              filterSlugs: oldFilterSlugs,
            },
          },
        );
        if (!updatedProductAttributeResult.ok) {
          mutationPayload = {
            success: false,
            message: await getApiMessage('products.update.error'),
          };
          await session.abortTransaction();
          return;
        }
        await shopProductsCollection.updateMany(
          {
            productId: summary._id,
          },
          {
            $pullAll: {
              filterSlugs: oldFilterSlugs,
            },
          },
        );
        await productFacetsCollection.findOneAndUpdate(
          {
            _id: summary._id,
          },
          {
            $pull: {
              attributeIds: attributeId,
            },
            $pullAll: {
              filterSlugs: oldFilterSlugs,
            },
          },
        );

        // update product title
        execUpdateProductTitles(`productId=${summary._id.toHexString()}`);

        mutationPayload = {
          success: true,
          message: await getApiMessage('products.update.success'),
        };
        return;
      }

      // update attribute
      const updatedFilterSlugs = summary.filterSlugs.reduce((acc: string[], filterSlug) => {
        if (oldFilterSlugs.includes(filterSlug)) {
          return acc;
        }
        return [...acc, filterSlug];
      }, finalFilterSlugs);
      const updatedProductAttributeResult = await productSummariesCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            'attributes.$[oldAttribute]': {
              ...productAttribute,
              optionIds: finalOptionIds,
              filterSlugs: finalFilterSlugs,
            },
            filterSlugs: updatedFilterSlugs,
          },
        },
        {
          arrayFilters: [
            {
              'oldAttribute._id': productAttribute._id,
            },
          ],
        },
      );
      if (!updatedProductAttributeResult.ok) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('products.update.error'),
        };
        await session.abortTransaction();
        return;
      }
      await shopProductsCollection.updateMany(
        {
          productId: summary._id,
        },
        {
          $set: {
            filterSlugs: updatedFilterSlugs,
          },
        },
      );
      await productFacetsCollection.findOneAndUpdate(
        {
          _id: summary._id,
        },
        {
          $set: {
            filterSlugs: updatedFilterSlugs,
          },
        },
      );

      // update product title
      execUpdateProductTitles(`productId=${summary._id.toHexString()}`);
      mutationPayload = {
        success: true,
        message: await getApiMessage('products.update.success'),
        payload: summary,
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log('updateProductSelectAttribute', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
