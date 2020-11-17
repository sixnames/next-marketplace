import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { LanguageType } from './commonEntities';

@ObjectType()
export class RubricVariant {
  @Field(() => ID)
  readonly id: string;

  @Field(() => [LanguageType])
  @prop({ type: LanguageType, required: true })
  name: LanguageType[];

  @Field(() => String)
  readonly nameString: string;
}

export const RubricVariantModel = getModelForClass(RubricVariant);
