import { ObjectId } from 'mongodb';
import { DEFAULT_LOCALE } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getAttributeReadableValueLocales } from '../../../lib/productAttributesUtils';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_ATTRIBUTES, COL_PRODUCT_SUMMARIES } from '../../collectionNames';
import {
  AttributeModel,
  ProductPayloadModel,
  ProductSummaryModel,
  TranslationModel,
} from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

export interface UpdateProductTextAttributeItemInputInterface {
  productAttributeId: string;
  attributeId: string;
  textI18n?: TranslationModel | null;
}

export interface UpdateProductTextAttributeInputInterface {
  productId: string;
  attributes: UpdateProductTextAttributeItemInputInterface[];
}

export async function updateProductTextAttribute({
  input,
  context,
}: DaoPropsInterface<UpdateProductTextAttributeInputInterface>): Promise<ProductPayloadModel> {
  try {
    const { getApiMessage } = await getRequestParams(context);
    const { db } = await getDatabase();
    const productSummariesCollection = db.collection<ProductSummaryModel>(COL_PRODUCT_SUMMARIES);
    const attributesCollection = db.collection<AttributeModel>(COL_ATTRIBUTES);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateProduct',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('products.update.error'),
      };
    }
    const { attributes } = input;

    // get summary
    const productId = new ObjectId(input.productId);
    const summary = await productSummariesCollection.findOne({ _id: productId });
    if (!summary) {
      return {
        success: false,
        message: await getApiMessage('products.update.error'),
      };
    }

    for await (const inputAttribute of attributes) {
      const { textI18n } = inputAttribute;
      const productAttributeId = new ObjectId(inputAttribute.productAttributeId);
      const attributeId = new ObjectId(inputAttribute.attributeId);

      if (!textI18n || !textI18n[DEFAULT_LOCALE]) {
        await productSummariesCollection.findOneAndUpdate(
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
          },
        );
        continue;
      }

      // Check if product attribute exist
      let productAttribute = await summary.attributes.find(({ _id }) => {
        return _id.equals(productAttributeId);
      });

      const attribute = await attributesCollection.findOne({ _id: attributeId });
      if (!attribute) {
        continue;
      }
      const productAttributeNotExist = !productAttribute;

      // Create new product attribute if original is absent
      if (!productAttribute) {
        productAttribute = {
          _id: productAttributeId,
          attributeId,
          optionIds: [],
          filterSlugs: [],
          number: null,
          textI18n,
          readableValueI18n: {},
        };
      }
      const readableValueI18n = getAttributeReadableValueLocales({
        productAttribute: {
          ...productAttribute,
          attribute,
        },
        gender: summary.gender,
      });
      productAttribute.readableValueI18n = readableValueI18n;

      if (productAttributeNotExist) {
        await productSummariesCollection.findOneAndUpdate(
          {
            _id: summary._id,
          },
          {
            $push: {
              attributes: productAttribute,
            },
          },
        );
      } else {
        await productSummariesCollection.findOneAndUpdate(
          {
            _id: summary._id,
          },
          {
            $set: {
              'attributes.$[oldAttribute]': {
                ...productAttribute,
                textI18n: inputAttribute.textI18n,
              },
            },
          },
          {
            arrayFilters: [{ 'oldAttribute._id': { $eq: productAttribute._id } }],
          },
        );
      }
    }

    return {
      success: true,
      message: await getApiMessage('products.update.success'),
      payload: summary,
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
