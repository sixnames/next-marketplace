import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class ProductCardPrices {
  @Field(() => String)
  readonly min: string;

  @Field(() => String)
  readonly max: string;
}
