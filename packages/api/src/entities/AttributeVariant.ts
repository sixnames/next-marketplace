import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class AttributeVariant {
  @Field((_type) => ID)
  readonly id: string;

  @Field(() => String)
  readonly nameString: string;
}
