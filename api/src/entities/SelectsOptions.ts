import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GenderOption {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  readonly nameString: string;
}
