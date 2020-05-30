import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';

@ObjectType()
export class Option {
  @Field(() => ID)
  public id: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public name: string;

  @Field((_type) => String, { nullable: true })
  @prop()
  public color: string;
}

export const OptionModel = getModelForClass(Option);
