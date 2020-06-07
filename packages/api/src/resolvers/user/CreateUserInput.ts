import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  secondName?: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  role?: string;
}
