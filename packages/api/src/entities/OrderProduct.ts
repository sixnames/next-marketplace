import { Field, Float, ID, Int, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { ShopProduct, ShopProductOldPrice } from './ShopProduct';
import { Translation } from './Translation';
import { Shop } from './Shop';
import { Company } from './Company';

@ObjectType()
export class OrderProduct {
  @Field(() => ID)
  readonly id?: string;
  readonly _id?: string;

  @Field(() => Int)
  @prop({ required: true })
  itemId: number;

  @Field(() => Int)
  @prop({ default: 0 })
  price: number;

  @Field(() => [ShopProductOldPrice])
  @prop({ type: ShopProductOldPrice, required: true })
  oldPrices: ShopProductOldPrice[];

  @Field(() => Int)
  @prop({ default: 1 })
  amount: number;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  name: Translation[];

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  cardName: Translation[];

  @Field(() => String)
  @prop({ required: true })
  slug: string;

  @Field(() => [Translation])
  @prop({ type: Translation, required: true })
  description: Translation[];

  @Field(() => ShopProduct, { nullable: true })
  @prop({ required: true, ref: 'ShopProduct' })
  shopProduct: string;

  @Field((_type) => Shop, { nullable: true })
  @prop({ required: true, ref: 'Shop' })
  shop: string;

  @Field((_type) => Company, { nullable: true })
  @prop({ required: true, ref: 'Company' })
  company: string;

  @Field(() => String)
  readonly nameString?: string;

  @Field(() => String)
  readonly cardNameString?: string;

  @Field(() => String)
  readonly descriptionString?: string;

  @Field(() => String)
  readonly formattedPrice?: string;

  @Field(() => String, { nullable: true })
  readonly formattedOldPrice?: string | null;

  @Field(() => Float)
  readonly totalPrice?: number;

  @Field(() => String)
  readonly formattedTotalPrice?: string;

  @Field(() => Int, { nullable: true })
  readonly discountedPercent?: number | null;
}
