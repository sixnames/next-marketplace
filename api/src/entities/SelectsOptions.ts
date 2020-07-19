import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GenderOption {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  readonly nameString: string;
}

@ObjectType()
export class AttributePositioningOption {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  readonly nameString: string;
}

@ObjectType()
export class ISOLanguage {
  @Field((_type) => String)
  readonly id: string;

  @Field((_type) => String)
  readonly nameString: string;

  @Field((_type) => String)
  readonly nativeName: string;
}
