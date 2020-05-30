import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class SignInInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}
