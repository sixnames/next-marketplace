import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { BrandCollection } from './BrandCollection';

@ObjectType()
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class Brand extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ type: String, required: true, trim: true })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String, required: true, trim: true })
  slug: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  url?: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  description?: string;

  @Field(() => [BrandCollection])
  @prop({ type: String })
  collections: string[];

  @Field()
  readonly createdAt?: Date;

  @Field()
  readonly updatedAt?: Date;
}

export const BrandModel = getModelForClass(Brand);
