import { Field, ObjectType } from 'type-graphql';

export default function PayloadType() {
  @ObjectType({ isAbstract: true })
  abstract class PayloadTypeClass {
    @Field((_type) => Boolean)
    success: boolean;

    @Field((_type) => String)
    message: string;
  }

  return PayloadTypeClass;
}
