import { FieldResolver, Int, Resolver, Root } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import { Order } from '../../entities/Order';
import { OrderStatus, OrderStatusModel } from '../../entities/OrderStatus';
import { DEFAULT_LANG, SECONDARY_LANG } from '@yagu/config';
import getLangField from '../../utils/translations/getLangField';
import { Localization, LocalizationPayloadInterface } from '../../decorators/parameterDecorators';
import { getCurrencyString, noNaN } from '@yagu/shared';

@Resolver((_for) => Order)
export class OrderResolver {
  // Field resolvers
  @FieldResolver()
  async status(
    @Root() orderLog: DocumentType<Order>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<OrderStatus> {
    const status = await OrderStatusModel.findOne({ _id: orderLog.status });
    if (!status) {
      const notFoundName = [
        { key: DEFAULT_LANG, value: 'Статус не найден' },
        { key: SECONDARY_LANG, value: 'Status not found' },
      ];

      return {
        _id: '0',
        id: '0',
        itemId: 0,
        name: notFoundName,
        nameString: getLangField(notFoundName, lang),
      };
    }
    return status;
  }

  private async getTotalPrice(order: DocumentType<Order>): Promise<number> {
    return order.products.reduce((acc = 0, { price, amount }) => {
      return acc + noNaN(price) * noNaN(amount);
    }, 0);
  }

  @FieldResolver((_returns) => String)
  async formattedTotalPrice(
    @Root() order: DocumentType<Order>,
    @Localization() { lang }: LocalizationPayloadInterface,
  ): Promise<string> {
    const totalPrice = await this.getTotalPrice(order);
    return getCurrencyString({ value: totalPrice, lang });
  }

  @FieldResolver((_returns) => Int)
  async totalPrice(@Root() order: DocumentType<Order>): Promise<number> {
    return this.getTotalPrice(order);
  }

  @FieldResolver((_returns) => Int)
  async productsCount(@Root() order: DocumentType<Order>): Promise<number> {
    return order.products.length;
  }

  @FieldResolver()
  async id(@Root() order: DocumentType<Order>): Promise<string> {
    return `${order.id || order._id}`;
  }
}
