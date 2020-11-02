import { Field, ID, ObjectType } from 'type-graphql';
import { Product } from './Product';

@ObjectType()
export class ProductCardConnectionItem {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  value: string;

  @Field(() => Product)
  product: Product;
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
