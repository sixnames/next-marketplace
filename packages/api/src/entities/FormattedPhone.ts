import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FormattedPhone {
  @Field(() => String)
  readonly raw: string;

  @Field(() => String)
  readonly readable: string;
}
