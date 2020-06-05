import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './common';

@ObjectType()
export class RubricVariant {
  @Field(() => ID)
  public id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true, _id: false })
  public name: LanguageType[];

  @Field(() => String)
  public nameString: string;
}

export const RubricVariantModel = getModelForClass(RubricVariant);
