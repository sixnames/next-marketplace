import { Field, ID, ObjectType } from 'type-graphql';
import { Product } from './Product';

@ObjectType()
export class ProductCardConnectionItem {
  @Field(() => ID, { description: 'ID of product' })
  id: string;

  @Field(() => String, {
    description: 'Value of selected option for current product in connection',
  })
  value: string;

  @Field(() => Product)
  product: Product;

  @Field(() => Boolean)
  isCurrent: boolean;
}

@ObjectType()
export class ProductCardConnection {
  @Field(() => ID, { description: 'ID of connection' })
  id: string;

  @Field(() => String, { description: 'Name of attribute used for connection' })
  nameString: string;

  @Field(() => [ProductCardConnectionItem])
  products: ProductCardConnectionItem[];
}
