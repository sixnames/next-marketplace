import { Field, ID, Int, ObjectType } from 'type-graphql';
import { getModelForClass, plugin, prop } from '@typegoose/typegoose';
import { AutoIncrementID } from '@typegoose/auto-increment';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@ObjectType()
@plugin(AutoIncrementID, { field: 'itemId', startAt: 1 })
export class BrandCollection extends TimeStamps {
  @Field(() => ID)
  readonly id: string;

  @Field(() => Int)
  @prop()
  readonly itemId: number;

  @Field((_type) => String)
  @prop({ required: true, trim: true })
  nameString: string;

  @Field((_type) => String)
  @prop({ type: String, required: true, trim: true })
  slug: string;

  @Field((_type) => String, { nullable: true })
  @prop({ type: String })
  description?: string;

  @Field()
  readonly createdAt?: Date;

  @Field()
  readonly updatedAt?: Date;
}

export const BrandCollectionModel = getModelForClass(BrandCollection);
