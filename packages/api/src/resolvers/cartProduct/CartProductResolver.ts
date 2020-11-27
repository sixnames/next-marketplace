import { FieldResolver, Resolver, Root } from 'type-graphql';
import { CartProduct } from '../../entities/CartProduct';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => CartProduct)
export class CartProductResolver {
  // Field resolvers
  @FieldResolver((_returns) => ShopProduct)
  async shopProduct(@Root() cartProduct: DocumentType<CartProduct>): Promise<ShopProduct> {
    const shopProduct = await ShopProductModel.findById(cartProduct.shopProduct);
    if (!shopProduct) {
      throw Error('Shop product not found on CartProductResolver.shopProduct');
    }
    return shopProduct;
  }
}
