import { FieldResolver, Resolver, Root } from 'type-graphql';
import { OrderCustomer } from '../../entities/OrderCustomer';
import { DocumentType } from '@typegoose/typegoose';
import { User, UserModel } from '../../entities/User';
import { FormattedPhone } from '../../entities/FormattedPhone';
import { getFullName, getShortName, phoneToRaw, phoneToReadable } from '@yagu/shared';

@Resolver((_for) => OrderCustomer)
export class OrderCustomerResolver {
  // Field resolvers
  @FieldResolver()
  async user(@Root() orderCustomer: DocumentType<OrderCustomer>): Promise<User | null> {
    return UserModel.findOne({ _id: orderCustomer.user });
  }

  // Field resolvers
  @FieldResolver(() => String)
  fullName(@Root() orderCustomer: DocumentType<OrderCustomer>): string {
    return getFullName(orderCustomer);
  }

  @FieldResolver(() => String)
  shortName(@Root() orderCustomer: DocumentType<OrderCustomer>): string {
    return getShortName(orderCustomer);
  }

  @FieldResolver(() => FormattedPhone)
  formattedPhone(@Root() user: DocumentType<User>): FormattedPhone {
    const { phone } = user;
    return {
      raw: phoneToRaw(phone),
      readable: phoneToReadable(phone),
    };
  }

  @FieldResolver()
  async id(@Root() orderCustomer: DocumentType<OrderCustomer>): Promise<string> {
    return `${orderCustomer.id || orderCustomer._id}`;
  }
}
