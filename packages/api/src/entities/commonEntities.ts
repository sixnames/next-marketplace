import { registerEnumType } from 'type-graphql';

// Gender enum
export enum GenderEnum {
  she = 'she',
  he = 'he',
  it = 'it',
}

registerEnumType(GenderEnum, {
  name: 'GenderEnum',
  description: 'List of gender enums',
});
