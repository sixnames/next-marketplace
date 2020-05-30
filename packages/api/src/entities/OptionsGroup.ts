import { Field, ID, ObjectType } from 'type-graphql';
import { arrayProp, getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Option } from './Option';

@ObjectType()
export class OptionsGroup {
  @Field(() => ID)
  public id: string;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  public name: string;

  @Field((_type) => [Option])
  @arrayProp({ ref: Option })
  public options: Ref<Option>[];
}

export const OptionsGroupModel = getModelForClass(OptionsGroup);
