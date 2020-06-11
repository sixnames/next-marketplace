import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class AssetInput {
  @Field(() => String)
  public url: string;

  @Field(() => Int)
  public index: number;
}
