import { ObjectId } from 'mongodb';
import { castUrlFilters } from '../../../lib/castUrlFilters';
import getResolverErrorMessage from '../../../lib/getResolverErrorMessage';
import { getOperationPermission, getRequestParams } from '../../../lib/sessionHelpers';
import { COL_PROMO, COL_PROMO_PRODUCTS, COL_SHOP_PRODUCTS } from '../../collectionNames';
import { PromoModel, PromoProductModel, ShopProductModel } from '../../dbModels';
import { getDatabase } from '../../mongodb';
import { DaoPropsInterface } from '../../uiInterfaces';

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
      // cast selected filters
      const {
        brandStage,
        brandCollectionStage,
        optionsStage,
        pricesStage,
        searchStage,
        noSearchResults,
      } = await castUrlFilters({
        filters: input.filters,
        search: input.search,
        searchFieldName: 'productId',
      });

      // search stage
      if (noSearchResults) {
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
        rubricSlug: shopProduct.rubricSlug,
        rubricId: shopProduct.rubricId,
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
