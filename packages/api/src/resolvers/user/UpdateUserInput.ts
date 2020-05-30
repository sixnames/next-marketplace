import { Field, ID, InputType } from 'type-graphql';
import { User } from '../../entities/User';

@InputType()
export class UpdateUserInput implements Partial<User> {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  lastName: string;

  @Field({ nullable: true })
  secondName: string;

  @Field()
  phone: string;

  @Field()
  role: string;
}
