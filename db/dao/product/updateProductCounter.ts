import { DEFAULT_COMPANY_SLUG, VIEWS_COUNTER_STEP } from 'config/common';
import { COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { Maybe, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { getRequestParams, getSessionRole } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface UpdateProductCounterInputInterface {
  shopProductIds: string[];
  companySlug: Maybe<string>;
}

export async function updateProductCounter({
  input,
  context,
}: DaoPropsInterface<UpdateProductCounterInputInterface>): Promise<boolean> {
  try {
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
    const { role } = await getSessionRole(context);
    const { city } = await getRequestParams(context);

    // check input
    if (!input) {
      return false;
    }

    if (!role.isStaff) {
      const { shopProductIds } = input;
      const companySlug = input.companySlug || DEFAULT_COMPANY_SLUG;

      const shopProductObjectIds = shopProductIds.map((_id) => new ObjectId(_id));
      const updatedShopProductsResult = await shopProductsCollection.updateMany(
        {
          _id: { $in: shopProductObjectIds },
        },
        {
          $inc: {
            [`views.${companySlug}.${city}`]: VIEWS_COUNTER_STEP,
          },
        },
      );
      if (!updatedShopProductsResult.acknowledged) {
        return false;
      }
      return true;
    }
    return true;
  } catch (e) {
    console.log(e);
    return false;
  }
}
