import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class ProductCardBreadcrumb {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  readonly slug: string;

  @Field(() => String)
  readonly name: string;
}
