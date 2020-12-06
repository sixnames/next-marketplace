import { FieldResolver, Resolver, Root } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import { OrderStatus } from '../../entities/OrderStatus';

@Resolver((_of) => OrderStatus)
export class OrderStatusResolver {
  @FieldResolver()
  async nameString(
    @Root() orderStatue: DocumentType<OrderStatus>,
    @Localization() { getLangField }: LocalizationPayloadInterface,
  ): Promise<string> {
    return getLangField(orderStatue.name);
  }

  @FieldResolver()
  async id(@Root() orderStatue: DocumentType<OrderStatus>): Promise<string> {
    return `${orderStatue.id || orderStatue._id}`;
  }
}
