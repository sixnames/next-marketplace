import { COL_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ProductModel, ShopProductModel, ShopProductPayloadModel } from 'db/dbModels';
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

export type UpdateManyShopProductsInputType = UpdateShopProductInputInterface[];

export async function updateManyShopProducts({
  input,
  context,
}: DaoPropsInterface<UpdateManyShopProductsInputType>): Promise<ShopProductPayloadModel> {
  const { getApiMessage, locale } = await getRequestParams(context);
  const { db, client } = await getDatabase();
  const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);
  const productsCollection = db.collection<ProductModel>(COL_PRODUCTS);

  const session = client.startSession();

  let mutationPayload: ShopProductPayloadModel = {
    success: false,
    message: await getApiMessage('shopProducts.update.error'),
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
        slug: 'updateShopProduct',
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
        schema: updateManyShopProductsSchema,
      });
      await validationSchema.validate(input);

      let doneCount = 0;
      const barcodeDoubles: ShopProductBarcodeDoublesInterface[] = [];
      for await (const shopProductValues of input) {
        const { shopProductId, barcode, ...values } = shopProductValues;

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
          barcode,
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
              barcode,
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

        // update product barcode
        const updatedProductResult = await productsCollection.findOneAndUpdate(
          {
            _id: shopProduct.productId,
          },
          {
            $addToSet: {
              barcode: {
                $each: barcode,
              },
            },
          },
        );
        if (!updatedProductResult.ok) {
          break;
        }

        doneCount = doneCount + 1;
      }

      if (barcodeDoubles.length > 0) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
          barcodeDoubles,
        };
        await session.abortTransaction();
        return;
      }

      if (doneCount !== input.length) {
        mutationPayload = {
          success: false,
          message: await getApiMessage('shopProducts.update.error'),
        };
        await session.abortTransaction();
        return;
      }

      mutationPayload = {
        success: true,
        message: await getApiMessage('shopProducts.update.success'),
      };
    });

    return mutationPayload;
  } catch (e) {
    console.log(e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  } finally {
    await session.endSession();
  }
}
