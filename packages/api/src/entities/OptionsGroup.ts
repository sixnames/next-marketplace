import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';
import { Option } from './Option';
import { LanguageType } from './common';

@ObjectType()
export class OptionsGroup {
  @Field(() => ID)
  public id: string;

  @Field(() => LanguageType)
  @prop({ type: LanguageType, required: true, _id: false })
  public name: LanguageType[];

  @Field(() => String)
  public nameString: string;

  @Field((_type) => [Option])
  @prop({ ref: Option })
  public options: Ref<Option>[];
}

export const OptionsGroupModel = getModelForClass(OptionsGroup);
