import { Field, ID, InputType } from 'type-graphql';
import { AttributeTypeEnum } from '../../entities/Attribute';
import { OptionsGroup } from '../../entities/OptionsGroup';
import { Ref } from '@typegoose/typegoose';
import { Metric } from '../../entities/Metric';

@InputType()
export class UpdateAttributeInGroup {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  attributeId: string;

  @Field(() => String)
  name: string;

  @Field((_type) => AttributeTypeEnum)
  public type: AttributeTypeEnum;

  @Field((_type) => ID, { nullable: true })
  public options: Ref<OptionsGroup>;

  @Field((_type) => ID, { nullable: true })
  public metric: Ref<Metric>;
}
