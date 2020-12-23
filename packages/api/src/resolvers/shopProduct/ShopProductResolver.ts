import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Resolver, Root } from 'type-graphql';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { Product, ProductModel } from '../../entities/Product';
import { DocumentType } from '@typegoose/typegoose';
import { Shop, ShopModel } from '../../entities/Shop';
import { RoleRuleModel } from '../../entities/RoleRule';
import PayloadType from '../commonInputs/PayloadType';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import { UpdateShopProductInput } from './UpdateShopProductInput';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
  SessionCart,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { Cart } from '../../entities/Cart';
import { getCurrencyString, getPercentage, updateShopProductSchema } from '@yagu/shared';

const { operationConfigUpdate } = RoleRuleModel.getOperationsConfigs(ShopProduct.name);

@ObjectType()
class ShopProductPayloadType extends PayloadType() {
  @Field((_type) => ShopProduct, { nullable: true })
  product?: ShopProduct;
}

@Resolver((_for) => ShopProduct)
export class ShopProductResolver {
  @Mutation((_returns) => ShopProductPayloadType)
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateShopProductSchema })
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
            createdAt: new Date(),
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

  @FieldResolver((_returns) => String)
  async formattedPrice(
    @Root() shopProduct: DocumentType<ShopProduct>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getCurrencyString({ value: shopProduct.price, lang });
  }

  @FieldResolver((_returns) => String, { nullable: true })
  async formattedOldPrice(
    @Root() shopProduct: DocumentType<ShopProduct>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string | null> {
    const { oldPrices } = shopProduct;
    const lastOldPrice = oldPrices[oldPrices.length - 1];

    return lastOldPrice
      ? getCurrencyString({
          value: lastOldPrice.price,
          lang,
        })
      : null;
  }

  @FieldResolver((_returns) => String, { nullable: true })
  async inCartCount(
    @Root() shopProduct: DocumentType<ShopProduct>,
    @SessionCart() cart: DocumentType<Cart>,
  ): Promise<number> {
    const cartProduct = cart.products.find((cartProduct) => {
      return cartProduct?.shopProduct?.toString() === shopProduct.id.toString();
    });

    if (!cartProduct) {
      return 0;
    }

    return cartProduct.amount;
  }

  @FieldResolver((_returns) => Int, { nullable: true })
  async discountedPercent(@Root() shopProduct: DocumentType<ShopProduct>): Promise<number | null> {
    const { oldPrices } = shopProduct;
    const lastOldPrice = oldPrices[oldPrices.length - 1];

    return lastOldPrice && lastOldPrice.price > shopProduct.price
      ? getPercentage({
          fullValue: lastOldPrice.price,
          partialValue: shopProduct.price,
        })
      : null;
  }
}
