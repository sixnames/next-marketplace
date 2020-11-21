import { Field, ObjectType } from 'type-graphql';
import { prop } from '@typegoose/typegoose';
import { FormattedPhone } from './FormattedPhone';

@ObjectType()
export class Contacts {
  @Field(() => [String])
  @prop({ type: String, required: true, default: [] })
  public emails: string[];

  @Field(() => [String])
  @prop({ type: String, required: true, default: [] })
  public phones: string[];

  @Field((_type) => [FormattedPhone])
  readonly formattedPhones?: FormattedPhone[];
}
