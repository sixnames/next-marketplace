import { FieldResolver, Resolver, Root } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import { User, UserModel } from '../../entities/User';
import { OrderLog } from '../../entities/OrderLog';

@Resolver((_for) => OrderLog)
export class OrderLogResolver {
  // Field resolvers
  @FieldResolver()
  async executor(@Root() orderLog: DocumentType<OrderLog>): Promise<User | null> {
    return UserModel.findOne({ _id: orderLog.executor });
  }

  @FieldResolver()
  async id(@Root() orderLog: DocumentType<OrderLog>): Promise<string> {
    return `${orderLog.id || orderLog._id}`;
  }
}
