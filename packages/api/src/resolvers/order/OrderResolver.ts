import { Arg, Field, FieldResolver, Int, Mutation, ObjectType, Resolver, Root } from 'type-graphql';
import { DocumentType } from '@typegoose/typegoose';
import { Order, OrderModel } from '../../entities/Order';
import { OrderStatus, OrderStatusModel } from '../../entities/OrderStatus';
import {
  DEFAULT_LANG,
  ORDER_LOG_VARIANT_STATUS,
  ORDER_STATUS_NEW,
  ROLE_SLUG_GUEST,
  SECONDARY_LANG,
} from '@yagu/config';
import getLangField from '../../utils/translations/getLangField';
import {
  Localization,
  LocalizationPayloadInterface,
  SessionCart,
  SessionUser,
} from '../../decorators/parameterDecorators';
import { getCurrencyString, noNaN, phoneToRaw } from '@yagu/shared';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import PayloadType from '../commonInputs/PayloadType';
import { Cart, CartModel } from '../../entities/Cart';
import { ShopProductModel } from '../../entities/ShopProduct';
import { ProductModel } from '../../entities/Product';
import { OrderProduct } from '../../entities/OrderProduct';
import { User, UserModel } from '../../entities/User';
import { OrderLogVariantEnum } from '../../entities/OrderLog';
import { ShopModel } from '../../entities/Shop';
import { CompanyModel } from '../../entities/Company';
import { MakeAnOrderInput } from './MakeAnOrderInput';
import { RoleModel } from '../../entities/Role';
import generator from 'generate-password';
import { ValidateMethod } from '../../decorators/methodDecorators';
import { makeAnOrderSchema } from '@yagu/validation';

@ObjectType()
class OrderPayloadType extends PayloadType() {
  @Field((_type) => Order, { nullable: true })
  order?: Order | null;

  @Field((_type) => Cart, { nullable: true })
  cart?: Cart | null;
}

@Resolver((_for) => Order)
export class OrderResolver {
  @Mutation((_returns) => OrderPayloadType)
  @ValidateMethod({ schema: makeAnOrderSchema })
  async makeAnOrder(
    @SessionCart() cart: Cart,
    @SessionUser() sessionUser: User,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: MakeAnOrderInput,
  ) {
    try {
      let user = sessionUser;
      if (!sessionUser) {
        const guestRole = await RoleModel.findOne({ slug: ROLE_SLUG_GUEST });

        if (!guestRole) {
          return {
            success: false,
            message: await getApiMessage('orders.makeAnOrder.guestRoleNotFound'),
          };
        }

        const password = generator.generate({
          length: 10,
          numbers: true,
        });

        user = await UserModel.create({
          ...input,
          role: guestRole.id,
          password,
        });
      }

      if (!user) {
        return {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.userCreationError'),
        };
      }

      const updatedCart = await CartModel.findByIdAndUpdate(
        cart.id,
        {
          products: [],
        },
        {
          new: true,
        },
      );
      if (!updatedCart) {
        return {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.error'),
        };
      }

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
          message: await getApiMessage('orders.makeAnOrder.productsNotFound'),
        };
      }

      const initialStatus = await OrderStatusModel.findOne({ slug: ORDER_STATUS_NEW });
      if (!initialStatus) {
        return {
          success: false,
          message: await getApiMessage('orders.makeAnOrder.initialStatusNotFound'),
        };
      }

      const order = await OrderModel.create({
        status: initialStatus.id,
        products: populatedOrderProducts,
        comment: input.comment,
        customer: {
          phone: phoneToRaw(input.phone),
          name: input.name,
          email: input.email,
          secondName: user.secondName,
          lastName: user.lastName,
          itemId: user.itemId,
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
          message: await getApiMessage('orders.makeAnOrder.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('orders.makeAnOrder.success'),
        order,
        cart: updatedCart,
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
