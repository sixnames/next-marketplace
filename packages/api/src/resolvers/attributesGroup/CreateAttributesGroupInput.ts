import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateAttributesGroupInput {
  @Field(() => String)
  name: string;
}
