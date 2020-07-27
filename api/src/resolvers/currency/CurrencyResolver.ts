import { Arg, Ctx, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Currency, CurrencyModel } from '../../entities/Currency';
import PayloadType from '../common/PayloadType';
import { CreateCurrencyInput } from './CreateCurrencyInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateCurrencyInput } from './UpdateCurrencyInput';
import getMessagesByKeys from '../../utils/translations/getMessagesByKeys';
import { ContextInterface } from '../../types/context';
import { createCurrencySchema, updateCurrencySchema } from '../../validation/currencySchema';
import getApiMessage from '../../utils/translations/getApiMessage';

@ObjectType()
class CurrencyPayloadType extends PayloadType() {
  @Field((_type) => Currency, { nullable: true })
  currency?: Currency;
}

@Resolver((_of) => Currency)
export class CurrencyResolver {
  @Query((_returns) => [Currency])
  async getAllCurrencies(): Promise<Currency[]> {
    return CurrencyModel.find({});
  }

  @Query((_returns) => Currency)
  async getCurrency(@Arg('id', (_type) => ID) id: string): Promise<Currency | null> {
    return CurrencyModel.findById(id);
  }

  @Mutation((_returns) => CurrencyPayloadType)
  async createCurrency(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: CreateCurrencyInput,
  ): Promise<CurrencyPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys(['validation.currencies.nameString']);
      await createCurrencySchema({ messages, lang }).validate(input);

      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.create.duplicate', lang }),
        };
      }

      const currency = await CurrencyModel.create(input);

      if (!currency) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.create.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'currencies.create.success', lang }),
        currency,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CurrencyPayloadType)
  async updateCurrency(
    @Ctx() ctx: ContextInterface,
    @Arg('input') input: UpdateCurrencyInput,
  ): Promise<CurrencyPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.currencies.nameString',
        'validation.currencies.id',
      ]);
      await updateCurrencySchema({ messages, lang }).validate(input);

      const { id, ...restInput } = input;
      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.update.duplicate', lang }),
        };
      }

      const currency = await CurrencyModel.findByIdAndUpdate(id, restInput, { new: true });

      if (!currency) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.update.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'currencies.update.success', lang }),
        currency,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CurrencyPayloadType)
  async deleteCurrency(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CurrencyPayloadType> {
    try {
      const { lang } = ctx.req;
      // TODO check if used in Countries
      const currency = await CurrencyModel.findByIdAndDelete(id);

      if (!currency) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.delete.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'currencies.delete.success', lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
