import { PaginateInput } from '../common/PaginateInput';
import { Field, InputType, registerEnumType } from 'type-graphql';

enum UserSortByEnum {
  email = 'email',
  name = 'name',
  lastName = 'lastName',
  secondName = 'secondName',
  phone = 'phone',
  role = 'role',
  createdAt = 'createdAt',
}

registerEnumType(UserSortByEnum, {
  name: 'UserSortByEnum',
  description: 'User pagination sortBy enum',
});

@InputType()
export class UserPaginateInput extends PaginateInput {
  @Field((_type) => UserSortByEnum, { defaultValue: 'createdAt' })
  sortBy?: UserSortByEnum;
}
