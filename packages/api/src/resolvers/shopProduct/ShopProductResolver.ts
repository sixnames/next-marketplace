import { FieldResolver, Resolver, Root } from 'type-graphql';
import { ShopProduct } from '../../entities/ShopProduct';
import { Product, ProductModel } from '../../entities/Product';
import { DocumentType } from '@typegoose/typegoose';
import { Shop, ShopModel } from '../../entities/Shop';

@Resolver((_for) => ShopProduct)
export class ShopProductResolver {
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
