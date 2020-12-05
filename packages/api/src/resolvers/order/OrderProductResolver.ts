import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { OrderProduct } from '../../entities/OrderProduct';
import { DocumentType } from '@typegoose/typegoose';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { Shop, ShopModel } from '../../entities/Shop';
import { Company, CompanyModel } from '../../entities/Company';
import { getCurrencyString, getPercentage, noNaN } from '@yagu/shared';

@Resolver((_for) => OrderProduct)
export class OrderProductResolver {
  // Field resolvers
  private async getTotalPrice(orderProduct: DocumentType<OrderProduct>): Promise<number> {
    const { price, amount } = orderProduct;
    return noNaN(price) * noNaN(amount);
  }

  @FieldResolver((_type) => String)
  async nameString(
    @Root() orderProduct: DocumentType<OrderProduct>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(orderProduct.name);
  }

  @FieldResolver((_type) => String)
  async cardNameString(
    @Root() orderProduct: DocumentType<OrderProduct>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(orderProduct.cardName);
  }

  @FieldResolver((_type) => String)
  async descriptionString(
    @Root() orderProduct: DocumentType<OrderProduct>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(orderProduct.description);
  }

  @FieldResolver((_type) => String)
  async shopProduct(@Root() orderProduct: DocumentType<OrderProduct>): Promise<ShopProduct | null> {
    return ShopProductModel.findOne({ _id: orderProduct.shopProduct });
  }

  @FieldResolver((_type) => String)
  async shop(@Root() orderProduct: DocumentType<OrderProduct>): Promise<Shop | null> {
    return ShopModel.findOne({ _id: orderProduct.shop });
  }

  @FieldResolver((_type) => String)
  async company(@Root() orderProduct: DocumentType<OrderProduct>): Promise<Company | null> {
    return CompanyModel.findOne({ _id: orderProduct.shopProduct });
  }

  @FieldResolver((_returns) => String)
  async formattedPrice(
    @Root() orderProduct: DocumentType<OrderProduct>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getCurrencyString({ value: orderProduct.price, lang });
  }

  @FieldResolver((_returns) => String, { nullable: true })
  async formattedOldPrice(
    @Root() orderProduct: DocumentType<OrderProduct>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string | null> {
    const { oldPrices } = orderProduct;
    const lastOldPrice = oldPrices[oldPrices.length - 1];

    return lastOldPrice
      ? getCurrencyString({
          value: lastOldPrice.price,
          lang,
        })
      : null;
  }

  @FieldResolver((_returns) => String)
  async formattedTotalPrice(
    @Root() orderProduct: DocumentType<OrderProduct>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    const totalPrice = await this.getTotalPrice(orderProduct);
    return getCurrencyString({ value: totalPrice, lang });
  }

  @FieldResolver((_returns) => Int)
  async totalPrice(@Root() orderProduct: DocumentType<OrderProduct>): Promise<number> {
    return this.getTotalPrice(orderProduct);
  }

  @FieldResolver((_returns) => Int, { nullable: true })
  async discountedPercent(
    @Root() orderProduct: DocumentType<OrderProduct>,
  ): Promise<number | null> {
    const { oldPrices } = orderProduct;
    const lastOldPrice = oldPrices[oldPrices.length - 1];

    return lastOldPrice && lastOldPrice.price > orderProduct.price
      ? getPercentage({
          fullValue: lastOldPrice.price,
          partialValue: orderProduct.price,
        })
      : null;
  }

  @FieldResolver()
  async id(@Root() orderProduct: DocumentType<OrderProduct>): Promise<string> {
    return `${orderProduct.id || orderProduct._id}`;
  }
}
