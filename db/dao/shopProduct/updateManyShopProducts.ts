import { COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ShopProductModel, ShopProductPayloadModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface, ShopProductBarcodeDoublesInterface } from 'db/uiInterfaces';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { checkShopProductBarcodeIntersects } from 'lib/productUtils';
import {
  getOperationPermission,
  getRequestParams,
  getResolverValidationSchema,
} from 'lib/sessionHelpers';
import { getUpdatedShopProductPrices } from 'lib/shopUtils';
import { ObjectId } from 'mongodb';
import { updateManyShopProductsSchema } from 'validation/shopSchema';

export interface UpdateShopProductInputInterface {
  shopProductId: string;
  available: number;
  price: number;
  barcode: string[];
}

export type UpdateManyShopProductsInputInterface = UpdateShopProductInputInterface[];

export async function updateManyShopProducts({
  input,
  context,
}: DaoPropsInterface<UpdateManyShopProductsInputInterface>): Promise<ShopProductPayloadModel> {
  try {
    const { getApiMessage, locale } = await getRequestParams(context);
    const { db } = await getDatabase();
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    // check input
    if (!input) {
      return {
        success: false,
        message: await getApiMessage('shopProducts.update.error'),
      };
    }

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'updateShopProduct',
    });
    if (!allow) {
      return {
        success: false,
        message,
      };
    }

    // Validate
    const validationSchema = await getResolverValidationSchema({
      context,
      schema: updateManyShopProductsSchema,
    });
    await validationSchema.validate(input);

    let doneCount = 0;
    const barcodeDoubles: ShopProductBarcodeDoublesInterface[] = [];
    for await (const shopProductValues of input) {
      const { shopProductId, ...values } = shopProductValues;

      // Check shop product availability
      const shopProductObjectId = new ObjectId(shopProductId);
      const shopProduct = await shopProductsCollection.findOne({ _id: shopProductObjectId });
      if (!shopProduct) {
        break;
      }

      const { discountedPercent, oldPrice, oldPriceUpdater } = getUpdatedShopProductPrices({
        shopProduct,
        newPrice: values.price,
      });

      // check barcode doubles
      const shopProductBarcodeDoubles = await checkShopProductBarcodeIntersects({
        barcode: values.barcode,
        locale,
        shopProductId: shopProduct._id,
      });
      if (shopProductBarcodeDoubles.length > 0) {
        shopProductBarcodeDoubles.forEach((double) => {
          barcodeDoubles.push(double);
        });
        break;
      }

      // Update shop product
      const updatedShopProductResult = await shopProductsCollection.findOneAndUpdate(
        { _id: shopProduct._id },
        {
          $set: {
            ...values,
            oldPrice,
            discountedPercent,
            updatedAt: new Date(),
          },
          ...oldPriceUpdater,
        },
        {
          returnDocument: 'after',
        },
      );
      const updatedShopProduct = updatedShopProductResult.value;
      if (!updatedShopProductResult.ok || !updatedShopProduct) {
        break;
      }

      doneCount = doneCount + 1;
    }

    if (barcodeDoubles.length > 0) {
      return {
        success: false,
        message: await getApiMessage('shopProducts.update.error'),
        barcodeDoubles,
      };
    }

    if (doneCount !== input.length) {
      return {
        success: false,
        message: await getApiMessage('shopProducts.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('shopProducts.update.success'),
    };
  } catch (e) {
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
