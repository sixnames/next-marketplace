import { PaginateInput } from '../common/PaginateInput';
import { Field, InputType, registerEnumType } from 'type-graphql';

export enum CompaniesSortByEnum {
  createdAt = 'createdAt',
}

registerEnumType(CompaniesSortByEnum, {
  name: 'CompaniesSortByEnum',
  description: 'Companies pagination sortBy enum',
});

@InputType()
export class CompanyPaginateInput extends PaginateInput {
  @Field((_type) => CompaniesSortByEnum, { nullable: true, defaultValue: 'createdAt' })
  sortBy?: CompaniesSortByEnum;
}
