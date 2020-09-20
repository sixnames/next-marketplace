import { Field, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class SignUpInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  secondName: string;

  @Field({ nullable: true })
  phone: string;

  @Field()
  password: string;
}
