import { PaginatedShopsResponse, Shop, ShopModel } from '../../entities/Shop';
import {
  Arg,
  Field,
  FieldResolver,
  ID,
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
import PayloadType from '../common/PayloadType';
import { ProductModel } from '../../entities/Product';
import { AddProductToShopInput } from './AddProductToShopInput';
import { PaginatedShopProductsResponse, ShopProductModel } from '../../entities/ShopProduct';
import { addProductToShopSchema } from '@yagu/validation';
import { ShopProductPaginateInput } from './ShopProductPaginateInput';
import generatePaginationOptions from '../../utils/generatePaginationOptions';
import { ShopPaginateInput } from './ShopPaginateInput';

const { operationConfigRead, operationConfigUpdate } = RoleRuleModel.getOperationsConfigs(
  Shop.name,
);

@ObjectType()
class ShopPayloadtype extends PayloadType() {
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

  @Mutation((_returns) => ShopPayloadtype)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: addProductToShopSchema })
  async addProductToShop(
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Shop>,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: AddProductToShopInput,
  ): Promise<ShopPayloadtype> {
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
      shop,
    };
  }

  // Field resolvers
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
}
