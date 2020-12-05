import { Field, FieldResolver, Int, Mutation, ObjectType, Resolver, Root } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import { Order, OrderModel } from '../../entities/Order';
import { OrderStatus, OrderStatusModel } from '../../entities/OrderStatus';
import {
  DEFAULT_LANG,
  ORDER_LOG_VARIANT_STATUS,
  ORDER_STATUS_NEW,
  SECONDARY_LANG,
} from '@yagu/config';
import getLangField from '../../utils/translations/getLangField';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionCart,
  SessionUser,
} from '../../decorators/parameterDecorators';
import { getCurrencyString, noNaN } from '@yagu/shared';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import PayloadType from '../commonInputs/PayloadType';
import { Cart } from '../../entities/Cart';
import { ShopProductModel } from '../../entities/ShopProduct';
import { ProductModel } from '../../entities/Product';
import { OrderProduct } from '../../entities/OrderProduct';
import { User } from '../../entities/User';
import { OrderLogVariantEnum } from '../../entities/OrderLog';
import { ShopModel } from '../../entities/Shop';
import { CompanyModel } from '../../entities/Company';

@ObjectType()
class OrderPayloadType extends PayloadType() {
  @Field((_type) => Order, { nullable: true })
  order?: Order | null;
}

@Resolver((_for) => Order)
export class OrderResolver {
  @Mutation((_returns) => OrderPayloadType)
  async makeAnOrder(@SessionCart() cart: Cart, @SessionUser() user: User) {
    try {
      const populatedOrderProducts: OrderProduct[] = [];

      for await (const cartProduct of cart.products) {
        const { amount } = cartProduct;
        const shopProduct = await ShopProductModel.findById(cartProduct.shopProduct);
        if (!shopProduct) {
          break;
        }
        const { price, oldPrices } = shopProduct;

        const product = await ProductModel.findById(shopProduct.product);
        if (!product) {
          break;
        }
        const { itemId, name, cardName, slug, description } = product;

        const shop = await ShopModel.findOne({ products: { $in: [shopProduct.id] } });
        if (!shop) {
          break;
        }

        const company = await CompanyModel.findOne({ shops: { $in: [shop.id] } });
        if (!company) {
          break;
        }

        populatedOrderProducts.push({
          itemId,
          name,
          cardName,
          slug,
          description,
          amount,
          price,
          oldPrices,
          shopProduct: shopProduct.id,
          shop: shop.id,
          company: company.id,
        });
      }

      if (populatedOrderProducts.length !== cart.products.length) {
        return {
          success: false,
          message: 'productsNotFound',
        };
      }

      const initialStatus = await OrderStatusModel.findOne({ slug: ORDER_STATUS_NEW });
      if (!initialStatus) {
        return {
          success: false,
          message: 'statusNotFound',
        };
      }

      // TODO create customer if no session user
      const order = await OrderModel.create({
        status: initialStatus.id,
        products: populatedOrderProducts,
        customer: {
          secondName: user.secondName,
          phone: user.phone,
          name: user.name,
          lastName: user.lastName,
          itemId: user.itemId,
          email: user.email,
          user: user.id,
        },
        logs: [
          {
            executor: user.id,
            variant: ORDER_LOG_VARIANT_STATUS as OrderLogVariantEnum,
            createdAt: new Date(),
          },
        ],
      });

      if (!order) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
        order,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // Field resolvers
  @FieldResolver((_returns) => OrderStatus)
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
        slug: 'notFound',
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

  @FieldResolver((_returns) => String)
  async id(@Root() order: DocumentType<Order>): Promise<string> {
    return `${order.id || order._id}`;
  }
}
