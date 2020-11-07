import { Field, ID, InputType } from 'type-graphql';
import { AttributeVariantEnum } from '../../entities/Attribute';
import { LangInput } from '../common/LangInput';
import { AttributePositioningInTitleInput } from './AddAttributeToGroupInput';

@InputType()
export class UpdateAttributeInGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => ID)
  attributeId: string;

  @Field(() => [LangInput])
  name: LangInput[];

  @Field((_type) => AttributeVariantEnum)
  variant: AttributeVariantEnum;

  @Field((_type) => ID, { nullable: true })
  optionsGroup?: string;

  @Field((_type) => ID, { nullable: true })
  metric?: string;

  @Field((_type) => [AttributePositioningInTitleInput], { nullable: true })
  positioningInTitle?: AttributePositioningInTitleInput[];
}
