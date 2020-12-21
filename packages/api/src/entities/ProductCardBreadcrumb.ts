import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class ProductCardBreadcrumb {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  readonly href: string;

  @Field(() => String)
  readonly name: string;
}
