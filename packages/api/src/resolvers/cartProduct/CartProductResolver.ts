import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { CartProduct } from '../../entities/CartProduct';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { DocumentType } from '@typegoose/typegoose';
import { Product, ProductModel } from '../../entities/Product';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import { noNaN } from '../../utils/numbers';
import { getCurrencyString } from '../../utils/intl';

@Resolver((_for) => CartProduct)
export class CartProductResolver {
  // Methods
  private async getTotalPrice(cartProduct: DocumentType<CartProduct>): Promise<number> {
    const shopProduct = await ShopProductModel.findOne({ _id: cartProduct.shopProduct });
    if (!shopProduct) {
      return 0;
    }
    return noNaN(shopProduct.price) * noNaN(cartProduct.amount);
  }

  // Field resolvers
  @FieldResolver((_returns) => ShopProduct, { nullable: true })
  async shopProduct(@Root() cartProduct: DocumentType<CartProduct>): Promise<ShopProduct | null> {
    return ShopProductModel.findById(cartProduct.shopProduct);
  }

  @FieldResolver((_returns) => Product, { nullable: true })
  async product(@Root() cartProduct: DocumentType<CartProduct>): Promise<Product | null> {
    return ProductModel.findById(cartProduct.product);
  }

  @FieldResolver((_returns) => Boolean)
  async isShopless(@Root() cartProduct: DocumentType<CartProduct>): Promise<boolean> {
    return !cartProduct.shopProduct;
  }

  @FieldResolver((_returns) => String)
  async formattedTotalPrice(
    @Root() cartProduct: DocumentType<CartProduct>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    const totalPrice = await this.getTotalPrice(cartProduct);
    return getCurrencyString({ value: totalPrice, lang });
  }

  @FieldResolver((_returns) => Int)
  async totalPrice(@Root() cartProduct: DocumentType<CartProduct>): Promise<number> {
    return this.getTotalPrice(cartProduct);
  }
}
