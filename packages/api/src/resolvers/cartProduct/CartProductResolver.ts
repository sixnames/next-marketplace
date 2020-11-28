import { FieldResolver, Resolver, Root } from 'type-graphql';
import { CartProduct } from '../../entities/CartProduct';
import { ShopProduct, ShopProductModel } from '../../entities/ShopProduct';
import { DocumentType } from '@typegoose/typegoose';
import { Product, ProductModel } from '../../entities/Product';

@Resolver((_for) => CartProduct)
export class CartProductResolver {
  // Field resolvers
  @FieldResolver((_returns) => ShopProduct, { nullable: true })
  async shopProduct(@Root() cartProduct: DocumentType<CartProduct>): Promise<ShopProduct | null> {
    return ShopProductModel.findById(cartProduct.shopProduct);
  }

  @FieldResolver((_returns) => Product, { nullable: true })
  async product(@Root() cartProduct: DocumentType<CartProduct>): Promise<Product | null> {
    return ProductModel.findById(cartProduct.product);
  }
}
