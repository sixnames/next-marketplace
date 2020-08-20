import { Field, Int, ObjectType } from 'type-graphql';
import { LanguageType } from './common';
import { getModelForClass, prop, Ref } from '@typegoose/typegoose';

@ObjectType()
export class NavItem {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => [LanguageType])
  @prop({ type: LanguageType })
  name: LanguageType[];

  @prop({ type: String })
  slug: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  path?: string;

  @Field((_type) => String)
  @prop({ type: String })
  navGroup: string;

  @Field((_type) => Int)
  @prop({ type: Number })
  order: number;

  @Field((_type) => String)
  readonly nameString: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  icon?: string | null;

  @Field((_type) => NavItem, { nullable: true })
  @prop({ ref: NavItem })
  parent?: Ref<NavItem> | null;

  @Field((_type) => [NavItem], { nullable: true })
  @prop({ ref: NavItem })
  children: Ref<NavItem>[];
}

export const NavItemModel = getModelForClass(NavItem);
