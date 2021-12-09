import { COL_PROMO, COL_PROMO_PRODUCTS, COL_SHOP_PRODUCTS } from 'db/collectionNames';
import { ObjectIdModel, PromoModel, PromoProductModel, ShopProductModel } from 'db/dbModels';
import { getDatabase } from 'db/mongodb';
import { DaoPropsInterface } from 'db/uiInterfaces';
import { getAlgoliaProductsSearch } from 'lib/algolia/productAlgoliaUtils';
import { castCatalogueFilters } from 'lib/catalogueUtils';
import getResolverErrorMessage from 'lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from 'lib/sessionHelpers';
import { ObjectId } from 'mongodb';

export interface AddPromoProductsInputInterface {
  promoId: string;
  rubricId: string;
  companyId: string;
  filters: string[];
  search?: string | null;
  all: boolean;
  shopProductIds: string[];
}

export async function addPromoProducts({
  input,
  context,
}: DaoPropsInterface<AddPromoProductsInputInterface>) {
  try {
    const { db } = await getDatabase();
    const { getApiMessage } = await getRequestParams(context);
    const promoCollection = db.collection<PromoModel>(COL_PROMO);
    const promoProductsCollection = db.collection<PromoProductModel>(COL_PROMO_PRODUCTS);
    const shopProductsCollection = db.collection<ShopProductModel>(COL_SHOP_PRODUCTS);

    // permission
    const { allow, message } = await getOperationPermission({
      context,
      slug: 'addPromoProduct',
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
        message: await getApiMessage('promoProduct.create.error'),
      };
    }
    const rubricId = new ObjectId(input.rubricId);
    const companyId = new ObjectId(input.companyId);
    const promoId = new ObjectId(input.promoId);

    // get promo
    const promo = await promoCollection.findOne({ _id: promoId });
    if (!promo) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.create.error'),
      };
    }
    const promoEnded = new Date(promo.endAt).getTime() < new Date().getTime();
    if (promoEnded) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.create.error'),
      };
    }

    let shopProducts: ShopProductModel[] = [];

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

      shopProducts = await shopProductsCollection
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
    } else {
      // get selected shop products
      const shopProductIds = input.shopProductIds.map((_id) => new ObjectId(_id));
      if (shopProductIds.length > 0) {
        shopProducts = await shopProductsCollection
          .aggregate<ShopProductModel>([
            {
              $match: {
                _id: {
                  $in: shopProductIds,
                },
              },
            },
          ])
          .toArray();
      }
    }

    // cast shop products to promo products
    const promoProducts: PromoProductModel[] = [];
    shopProducts.forEach((shopProduct) => {
      const promoProduct: PromoProductModel = {
        _id: new ObjectId(),
        shopProductId: shopProduct._id,
        companyId: shopProduct.companyId,
        companySlug: shopProduct.companySlug,
        productId: shopProduct.productId,
        shopId: shopProduct.shopId,
        promoId,
        discountPercent: promo.discountPercent,
        addCategoryDiscount: promo.addCategoryDiscount,
        useBiggestDiscount: promo.useBiggestDiscount,
        cashbackPercent: promo.cashbackPercent,
        addCategoryCashback: promo.addCategoryCashback,
        useBiggestCashback: promo.useBiggestCashback,
        allowPayFromCashback: promo.allowPayFromCashback,
        startAt: new Date(promo.startAt),
        endAt: new Date(promo.endAt),
      };
      promoProducts.push(promoProduct);
    });

    // add promo products
    if (promoProducts.length < 1) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.create.error'),
      };
    }
    const createPromoProductsResult = await promoProductsCollection.insertMany(promoProducts);
    if (!createPromoProductsResult.acknowledged) {
      return {
        success: false,
        message: await getApiMessage('promoProduct.create.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('promoProduct.create.success'),
    };
  } catch (e) {
    console.log('addPromoProduct error ', e);
    return {
      success: false,
      message: getResolverErrorMessage(e),
    };
  }
}
