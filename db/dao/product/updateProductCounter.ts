import { ObjectId } from 'mongodb';
import { DEFAULT_COMPANY_SLUG, VIEWS_COUNTER_STEP } from '../../../config/common';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getSessionRole } from '../../../lib/sessionHelpers';
import { COL_SHOP_PRODUCTS } from '../../collectionNames';
import { ProductPayloadModel, ShopProductModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

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
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
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

    if (!role.isStaff && shopProductObjectIds.length > 0) {
      const companySlug = input.companySlug || DEFAULT_COMPANY_SLUG;
      const updatedShopProductsResult = await shopProductsCollection.updateMany(
        {
          _id: { $in: shopProductObjectIds },
        },
        {
          $inc: {
            [`views.${companySlug}.${citySlug}`]: VIEWS_COUNTER_STEP,
          },
        },
      );
      if (!updatedShopProductsResult.acknowledged) {
        return {
          success: false,
          message: 'update error',
        };
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
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
