import { Field, InputType } from 'type-graphql';

@InputType()
export class MakeAnOrderInput {
  @Field((_type) => String)
  name: string;

  @Field((_type) => String)
  phone: string;

  @Field((_type) => String)
  email: string;
}
