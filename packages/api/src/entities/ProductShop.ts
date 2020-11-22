import { Field, Int, ObjectType } from 'type-graphql';
import { ShopProduct } from './ShopProduct';
import { Shop } from './Shop';

@ObjectType()
export class ProductShop extends ShopProduct {
  @Field(() => Shop)
  readonly node: Shop;

  @Field(() => String)
  readonly formattedPrice: string;

  @Field(() => String, { nullable: true })
  readonly formattedOldPrice?: string | null;

  @Field(() => Int, { nullable: true })
  readonly discountedPercent?: number | null;
}
