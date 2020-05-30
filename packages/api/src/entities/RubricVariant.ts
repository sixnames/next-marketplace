import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

@ObjectType()
export class RubricVariant {
  @Field(() => ID)
  public id: string;

  @Field(() => String)
  @prop({ required: true, trim: true })
  public name: string;
}

export const RubricVariantModel = getModelForClass(RubricVariant);
