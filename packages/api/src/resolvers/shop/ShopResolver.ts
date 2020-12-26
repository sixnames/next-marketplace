import { PaginatedShopsResponse, Shop, ShopModel } from '../../entities/Shop';
import {
  Arg,
  Field,
  FieldResolver,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import { RoleRuleModel } from '../../entities/RoleRule';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { Company, CompanyModel } from '../../entities/Company';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../commonInputs/PayloadType';
import { ProductModel } from '../../entities/Product';
import { AddProductToShopInput } from './AddProductToShopInput';
import {
  PaginatedShopProductsResponse,
  ShopProduct,
  ShopProductModel,
} from '../../entities/ShopProduct';
import { ShopProductPaginateInput } from './ShopProductPaginateInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { ShopPaginateInput } from './ShopPaginateInput';
import { DeleteProductFromShopInput } from './DeleteProductFromShopInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { ASSETS_DIST_SHOPS, ASSETS_DIST_SHOPS_LOGOS } from '../../config';
import del from 'del';
import { generateSlug } from '../../utils/slug';
import storeUploads from '../../utils/assets/storeUploads';
import { UpdateShopInput } from './UpdateShopInput';
import { City, CityModel } from '../../entities/City';
import {
  addProductToShopSchema,
  deleteProductFromShopSchema,
  updateShopSchema,
} from '@yagu/shared';

const { operationConfigRead, operationConfigUpdate } = RoleRuleModel.getOperationsConfigs(
  Shop.name,
);

@ObjectType()
class ShopPayloadType extends PayloadType() {
  @Field((_type) => Shop, { nullable: true })
  shop?: Shop;
}

@Resolver((_for) => Shop)
export class ShopResolver {
  @Query((_returns) => Shop)
  @AuthMethod(operationConfigRead)
  async getShop(
    @Arg('id', (_type) => ID) id: string,
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Shop>,
  ): Promise<Shop> {
    const shop = await ShopModel.findOne({ _id: id, ...customFilter });
    if (!shop) {
      throw Error('Shop not found in getShop resolver');
    }
    return shop;
  }

  @Query((_returns) => PaginatedShopsResponse)
  @AuthMethod(operationConfigRead)
  async getAllShops(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Shop>,
    @Arg('input', { nullable: true, defaultValue: {} })
    input: ShopPaginateInput,
  ): Promise<PaginatedShopsResponse> {
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc' } = input;
    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });
    return ShopModel.paginate({ ...customFilter }, options);
  }

  @Mutation((_returns) => ShopPayloadType)
  @ValidateMethod({ schema: updateShopSchema })
  @AuthMethod(operationConfigUpdate)
  async updateShop(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Shop>,
    @Arg('input') input: UpdateShopInput,
  ): Promise<ShopPayloadType> {
    try {
      const { shopId, ...values } = input;

      const shop = await ShopModel.findOne({ _id: shopId, ...customFilter });
      if (!shop) {
        return {
          success: false,
          message: await getApiMessage('shops.update.notFound'),
        };
      }

      const exist = await ShopModel.findOne({
        _id: { $ne: shop.id },
        nameString: values.nameString,
      });
      if (exist) {
        return {
          success: false,
          message: await getApiMessage('shops.update.duplicate'),
        };
      }

      // remove shop assets
      const assetsPath = `./assets/${ASSETS_DIST_SHOPS}/${shop.slug}`;
      const logoPath = `./assets/${ASSETS_DIST_SHOPS_LOGOS}/${shop.slug}`;
      await del(assetsPath);
      await del(logoPath);

      // update shop
      const slug = generateSlug(values.nameString);
      const [logoAsset] = await storeUploads({
        files: [values.logo[0]],
        slug,
        dist: ASSETS_DIST_SHOPS_LOGOS,
      });
      const photosAssets = await storeUploads({
        files: values.assets,
        slug,
        dist: ASSETS_DIST_SHOPS,
      });

      const updatedShop = await ShopModel.findByIdAndUpdate(
        shopId,
        {
          ...values,
          slug,
          address: {
            formattedAddress: values.address.formattedAddress,
            point: {
              coordinates: [values.address.point.lng, values.address.point.lat],
            },
          },
          logo: logoAsset,
          assets: photosAssets,
        },
        { new: true },
      );

      if (!updatedShop) {
        return {
          success: false,
          message: await getApiMessage('shops.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('shops.update.success'),
        shop: updatedShop,
      };
    } catch (e) {
      return {
        success: false,
        message: await getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => ShopPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: addProductToShopSchema })
  async addProductToShop(
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Shop>,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: AddProductToShopInput,
  ): Promise<ShopPayloadType> {
    const { shopId, productId, price, available } = input;
    const shop = await ShopModel.findOne({ _id: shopId, ...customFilter });
    if (!shop) {
      return {
        success: false,
        message: await getApiMessage('shops.update.notFound'),
      };
    }

    const product = await ProductModel.findOne({ _id: productId });
    if (!product) {
      return {
        success: false,
        message: await getApiMessage('shops.addProduct.notFound'),
      };
    }

    // check existing products
    const shopProducts = await ShopProductModel.find({ _id: { $in: shop.products } });
    const exist = shopProducts.find(({ product }) => product.toString() === productId);
    if (exist) {
      return {
        success: false,
        message: await getApiMessage('shops.addProduct.duplicate'),
      };
    }

    // create shop product
    const shopProduct = await ShopProductModel.create({
      price,
      available,
      oldPrices: [],
      product: productId,
      city: shop.city,
    });
    if (!shopProduct) {
      return {
        success: false,
        message: await getApiMessage('shops.addProduct.error'),
      };
    }

    // update shop
    const updatedShop = await ShopModel.findOneAndUpdate(
      {
        _id: shopId,
      },
      {
        $push: {
          products: shopProduct.id,
        },
      },
      {
        new: true,
      },
    );
    if (!updatedShop) {
      return {
        success: false,
        message: await getApiMessage('shops.addProduct.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('shops.addProduct.success'),
      shop: updatedShop,
    };
  }

  @Mutation((_returns) => ShopPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: deleteProductFromShopSchema })
  async deleteProductFromShop(
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<ShopProduct>,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: DeleteProductFromShopInput,
  ): Promise<ShopPayloadType> {
    try {
      const { shopId, productId } = input;
      const shop = await ShopModel.findOne({ _id: shopId, ...customFilter });
      if (!shop) {
        return {
          success: false,
          message: await getApiMessage('shops.update.notFound'),
        };
      }

      const product = await ShopProductModel.findOne({ _id: productId });
      if (!product) {
        return {
          success: false,
          message: await getApiMessage('shopProducts.delete.notFound'),
        };
      }

      // delete shop product
      const shopProduct = await ShopProductModel.findByIdAndDelete(productId);
      if (!shopProduct) {
        return {
          success: false,
          message: await getApiMessage('shops.addProduct.error'),
        };
      }

      // update shop
      const updatedShop = await ShopModel.findOneAndUpdate(
        {
          _id: shopId,
        },
        {
          $pull: {
            products: productId,
          },
        },
        {
          new: true,
        },
      );

      if (!updatedShop) {
        return {
          success: false,
          message: await getApiMessage('shopProducts.delete.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('shopProducts.delete.success'),
        shop: updatedShop,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // Field resolvers
  @FieldResolver((_returns) => City)
  async city(@Root() shop: DocumentType<Shop>): Promise<City> {
    const city = await CityModel.findOne({ slug: shop.city });
    if (!city) {
      throw Error('City not found on Shop city field');
    }
    return city;
  }

  @FieldResolver((_returns) => PaginatedShopProductsResponse)
  async products(
    @Root() shop: DocumentType<Shop>,
    @Arg('input', { nullable: true, defaultValue: {} })
    input: ShopProductPaginateInput,
  ): Promise<PaginatedShopProductsResponse> {
    const { limit = 100, page = 1, sortBy = 'createdAt', sortDir = 'desc' } = input;
    const { options } = generatePaginationOptions({
      limit,
      page,
      sortDir,
      sortBy,
    });
    return ShopProductModel.paginate({ _id: { $in: shop.products } }, options);
  }

  @FieldResolver((_returns) => Company)
  async company(@Root() shop: DocumentType<Shop>): Promise<Company> {
    const company = await CompanyModel.findOne({ shops: { $in: [shop.id] } });
    if (!company) {
      throw Error('Company not found on ShopResolver.company resolver');
    }
    return company;
  }

  @FieldResolver((_returns) => Int)
  async productsCount(@Root() shop: DocumentType<Shop>): Promise<number> {
    return shop.products.length;
  }
}
