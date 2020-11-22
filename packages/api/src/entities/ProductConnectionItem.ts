import { Field, ObjectType } from 'type-graphql';
import { Product } from './Product';

@ObjectType()
export class ProductConnectionItem {
  @Field(() => Product)
  node: Product;

  @Field(() => String, {
    description: 'Returns first value only because this attribute has to be Select variant',
  })
  value: string;

  @Field(() => String, {
    description: 'Returns name of selected attribute value',
  })
  optionName: string;
}
