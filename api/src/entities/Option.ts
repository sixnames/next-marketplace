import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './common';
import { prop as Property } from '@typegoose/typegoose/lib/prop';

@ObjectType()
export class Option {
  @Field(() => ID)
  readonly id: string;

  @Field(() => String)
  @Property({ required: true })
  slug: string;

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
