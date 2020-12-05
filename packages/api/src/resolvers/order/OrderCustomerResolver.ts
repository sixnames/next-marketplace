import { FieldResolver, Resolver, Root } from 'type-graphql';
import { OrderCustomer } from '../../entities/OrderCustomer';
import { DocumentType } from '@typegoose/typegoose';
import { User, UserModel } from '../../entities/User';

@Resolver((_for) => OrderCustomer)
export class OrderCustomerResolver {
  // Field resolvers
  @FieldResolver()
  async user(@Root() orderCustomer: DocumentType<OrderCustomer>): Promise<User | null> {
    return UserModel.findOne({ _id: orderCustomer.user });
  }

  @FieldResolver()
  async id(@Root() orderCustomer: DocumentType<OrderCustomer>): Promise<string> {
    return `${orderCustomer.id || orderCustomer._id}`;
  }
}
