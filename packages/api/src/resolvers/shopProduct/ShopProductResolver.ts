import { FieldResolver, Resolver, Root } from 'type-graphql';
import { ShopProduct } from '../../entities/ShopProduct';
import { Product, ProductModel } from '../../entities/Product';
import { DocumentType } from '@typegoose/typegoose';

@Resolver((_for) => ShopProduct)
export class ShopProductResolver {
  @FieldResolver((_returns) => Product)
  async product(@Root() shopProduct: DocumentType<ShopProduct>): Promise<Product> {
    const product = await ProductModel.findOne({ _id: shopProduct.product });
    if (!product) {
      throw Error('Product not found on ShopProductResolver.product');
    }
    return product;
  }
}
