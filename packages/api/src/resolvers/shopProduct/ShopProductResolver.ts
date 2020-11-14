import { Arg, Field, FieldResolver, Mutation, ObjectType, Resolver, Root } from 'type-graphql';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { Product, ProductModel } from '../../entities/Product';
import { DocumentType } from '@typegoose/typegoose';
import { Shop, ShopModel } from '../../entities/Shop';
import { RoleRuleModel } from '../../entities/RoleRule';
import PayloadType from '../common/PayloadType';
import { AuthMethod } from '../../decorators/methodDecorators';
import { UpdateShopProductInput } from './UpdateShopProductInput';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const {
  // operationConfigDelete,
  operationConfigUpdate,
} = RoleRuleModel.getOperationsConfigs(ShopProduct.name);

@ObjectType()
class ShopProductPayloadType extends PayloadType() {
  @Field((_type) => ShopProduct, { nullable: true })
  product?: ShopProduct;
}

@Resolver((_for) => ShopProduct)
export class ShopProductResolver {
  @Mutation((_returns) => ShopProductPayloadType)
  @AuthMethod(operationConfigUpdate)
  async updateShopProduct(
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<ShopProduct>,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: UpdateShopProductInput,
  ): Promise<ShopProductPayloadType> {
    const { productId, ...values } = input;
    const product = await ShopProductModel.findOne({ _id: productId, ...customFilter });
    if (!product) {
      return {
        success: false,
        message: await getApiMessage('shopProducts.update.notFound'),
      };
    }

    const updatedProduct = await ShopProductModel.findByIdAndUpdate(
      productId,
      {
        ...values,
        $push: {
          oldPrices: {
            price: product.price,
          },
        },
      },
      {
        new: true,
      },
    );

    if (!updatedProduct) {
      return {
        success: false,
        message: await getApiMessage('shopProducts.update.error'),
      };
    }

    return {
      success: true,
      message: await getApiMessage('shopProducts.update.success'),
      product: updatedProduct,
    };
  }

  // Field resolvers
  @FieldResolver((_returns) => Product)
  async product(@Root() shopProduct: DocumentType<ShopProduct>): Promise<Product> {
    const product = await ProductModel.findOne({ _id: shopProduct.product });
    if (!product) {
      throw Error('Product not found on ShopProductResolver.product');
    }
    return product;
  }

  @FieldResolver((_returns) => Shop)
  async shop(@Root() shopProduct: DocumentType<ShopProduct>): Promise<Shop> {
    const shop = await ShopModel.findOne({ products: { $in: [shopProduct.id] } });
    if (!shop) {
      throw Error('Shop not found on ShopProductResolver.shop');
    }
    return shop;
  }
}
