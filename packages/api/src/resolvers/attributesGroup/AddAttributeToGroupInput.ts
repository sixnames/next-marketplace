import { Field, ID, InputType } from 'type-graphql';
import { AttributePositionInTitleEnum, AttributeVariantEnum } from '../../entities/Attribute';
import { TranslationInput } from '../commonInputs/TranslationInput';

@InputType()
export class AttributePositioningInTitleInput {
  @Field(() => String)
  key: string;

  @Field(() => AttributePositionInTitleEnum)
  value: AttributePositionInTitleEnum;
}

@InputType()
export class AddAttributeToGroupInput {
  @Field(() => ID)
  groupId: string;

  @Field(() => [TranslationInput])
  name: TranslationInput[];

  @Field((_type) => AttributeVariantEnum)
  variant: AttributeVariantEnum;

  @Field((_type) => ID, { nullable: true })
  optionsGroup?: string;

  @Field((_type) => ID, { nullable: true })
  metric?: string;

  @Field((_type) => [AttributePositioningInTitleInput], { nullable: true })
  positioningInTitle?: AttributePositioningInTitleInput[];
}
