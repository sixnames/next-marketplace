import { Field, ID, InputType } from 'type-graphql';

@InputType()
export class UpdateMyProfileInput {
  @Field((_type) => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  secondName: string;

  @Field()
  phone: string;
}
