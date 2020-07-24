import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

@ObjectType()
export class Language {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  @prop({ type: String, required: true, trim: true })
  key: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  name: string;

  @Field(() => String)
  @prop({ type: String, required: true })
  nativeName: string;

  @Field(() => Boolean)
  @prop({ type: Boolean, required: true, default: false })
  isDefault: boolean;
}

export const LanguageModel = getModelForClass(Language);