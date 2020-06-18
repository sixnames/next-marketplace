import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './common';

@ObjectType()
export class Option {
  @Field(() => ID)
  readonly id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  color?: string | null;
}

export const OptionModel = getModelForClass(Option);
