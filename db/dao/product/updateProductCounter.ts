import { ObjectId } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, VIEWS_COUNTER_STEP } from 'lib/config/common';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getSessionRole } from 'lib/sessionHelpers';
import { ProductPayloadModel } from 'db/dbModels';
import { getDbCollections } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';

export interface UpdateProductCounterInputInterface {
  shopProductIds: string[];
  companySlug?: string | null;
  citySlug: string;
}

export async function updateProductCounter({
  input,
  context,
}: DaoPropsInterface<UpdateProductCounterInputInterface>): Promise<ProductPayloadModel> {
  try {
    const collections = await getDbCollections();
    const shopProductsCollection = collections.shopProductsCollection();
    const { role } = await getSessionRole(context);

    // check input
    if (!input) {
      return {
        success: false,
        message: 'no input',
      };
    }

    const { shopProductIds, citySlug } = input;
    const shopProductObjectIds = shopProductIds.map((_id) => new ObjectId(_id));
    const shopProducts = await shopProductsCollection
      .find(
        {
          _id: {
            $in: shopProductObjectIds,
          },
        },
        {
          projection: {
            _id: true,
            views: true,
          },
        },
      )
      .toArray();

    if (!role.isStaff && shopProductObjectIds.length > 0) {
      const companySlug = input.companySlug || DEFAULT_COMPANY_SLUG;
      for await (const shopProduct of shopProducts) {
        if (!shopProduct.views) {
          await shopProductsCollection.findOneAndUpdate(
            {
              _id: shopProduct._id,
            },
            {
              $set: {
                views: {
                  [companySlug]: {
                    [citySlug]: VIEWS_COUNTER_STEP,
                  },
                },
              },
            },
          );
        } else {
          await shopProductsCollection.findOneAndUpdate(
            {
              _id: shopProduct._id,
            },
            {
              $inc: {
                [`views.${companySlug}.${citySlug}`]: VIEWS_COUNTER_STEP,
              },
            },
          );
        }
      }

      return {
        success: true,
        message: 'success',
      };
    }
    return {
      success: true,
      message: 'success',
    };
  } catch (e) {
    console.log('updateProductCounter error', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
