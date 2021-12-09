import { COL_PROMO, COL_PROMO_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ObjectIdModel, PromoModel, PromoProductModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algolia/productAlgoliaUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface DeletePromoProductsInputInterface {
  promoId: string;
  companyId: string;
  rubricId: string;
  filters: string[];
  search?: string | null;
  all: boolean;
  shopProductId?: string;
}

export async function deletePromoProducts({
  input,
  context,
}: DaoPropsInterface<DeletePromoProductsInputInterface>) {
  try {
    const { db } = await getDatabase();
    const { getApiMessage } = await getRequestParams(context);
    const promoCollection = db.collection<PromoModel>(COL_PROMO);
    const promoProductsCollection = db.collection<PromoProductModel>(COL_PROMO_PRODUCTS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'deletePromoProduct',
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
        message: await getApiMessage('promoProduct.delete.error'),
      };
    }
    const rubricId = new ObjectId(input.rubricId);
    const promoId = new ObjectId(input.promoId);
    const companyId = new ObjectId(input.companyId);

    // get promo
    const promo = await promoCollection.findOne({ _id: promoId });
    if (!promo) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.delete.error'),
      };
    }
    const promoEnded = new Date(promo.endAt).getTime() < new Date().getTime();
    if (promoEnded) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.delete.error'),
      };
    }

    let shopProductIds: ObjectIdModel[] = [];

    // get all rubric shop products
    if (input.all) {
      const { search, filters } = input;
      // cast selected filters
      const { brandStage, brandCollectionStage, optionsStage, pricesStage } = castCatalogueFilters({
        filters,
      });

      // search stage
      let searchStage = {};
      let searchIds: ObjectIdModel[] = [];
      if (search) {
        searchIds = await getAlgoliaProductsSearch({
          search,
        });
        searchStage = {
          productId: {
            $in: searchIds,
          },
        };
      }
      if (search && searchIds.length < 1) {
        return {
          success: false,
          message: await getApiMessage('promoProduct.create.error'),
        };
      }

      const shopProducts = await shopProductsCollection
        .aggregate<ShopProductModel>([
          {
            $match: {
              rubricId,
              ...searchStage,
              ...brandStage,
              ...brandCollectionStage,
              ...optionsStage,
              ...pricesStage,
              companyId,
            },
          },
        ])
        .toArray();
      shopProducts.forEach(({ _id }) => shopProductIds.push(_id));
    } else {
      // get selected shop products
      if (input.shopProductId) {
        const shopProduct = await shopProductsCollection.findOne({
          _id: new ObjectId(input.shopProductId),
        });
        if (!shopProduct) {
          return {
            success: false,
            message: await getApiMessage('promoProduct.delete.error'),
          };
        }
        shopProductIds.push(shopProduct._id);
      }
    }

    // add promo products
    if (shopProductIds.length < 1) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.delete.error'),
      };
    }
    const createPromoProductsResult = await promoProductsCollection.deleteMany({
      promoId,
      shopProductId: {
        $in: shopProductIds,
      },
    });
    if (!createPromoProductsResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.delete.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('promoProduct.delete.success'),
    };
  } catch (e) {
    console.log('addPromoProduct error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
