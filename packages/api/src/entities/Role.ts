import { Field, ID, ObjectType } from 'type-graphql';
import { getModelForClass, prop } from '@typegoose/typegoose';
import { NavItem } from './NavItem';
import { RoleRule } from './RoleRule';
import { Translation } from './Translation';

@ObjectType()
export class Role {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => [Translation])
  @prop({ type: Translation })
  name: Translation[];

  @Field((_type) => String)
  readonly nameString: string;

  @Field((_type) => String)
  @prop({ type: String })
  description: string;

  @Field((_type) => String)
  @prop({ type: String, required: true })
  slug: string;

  @Field((_type) => Boolean)
  @prop({ type: Boolean })
  isStuff: boolean;

  @Field((_type) => [RoleRule])
  readonly rules: string[];

  @Field((_type) => [ID])
  @prop({ type: String })
  allowedAppNavigation: string[];

  @Field((_type) => [NavItem])
  readonly appNavigation: NavItem[];
}

export const RoleModel = getModelForClass(Role);
