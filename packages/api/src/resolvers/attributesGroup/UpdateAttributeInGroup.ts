import { Field, ID, InputType } from 'type-graphql';
import { AttributeVariantEnum } from '../../entities/Attribute';
import { OptionsGroup } from '../../entities/OptionsGroup';
import { Ref } from '@typegoose/typegoose';
import { Metric } from '../../entities/Metric';
import { LangInput } from '../common/LangInput';

@InputType()
export class UpdateAttributeInGroup {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  attributeId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => AttributeVariantEnum)
  public variant: AttributeVariantEnum;

  @Field((_type) => ID, { nullable: true })
  public options: Ref<OptionsGroup>;

  @Field((_type) => ID, { nullable: true })
  public metric: Ref<Metric>;
}
