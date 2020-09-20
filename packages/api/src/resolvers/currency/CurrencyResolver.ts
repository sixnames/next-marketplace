import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Currency, CurrencyModel } from '../../entities/Currency';
import PayloadType from '../common/PayloadType';
import { CreateCurrencyInput } from './CreateCurrencyInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateCurrencyInput } from './UpdateCurrencyInput';
import { createCurrencySchema, updateCurrencySchema } from '@yagu/validation';
import getApiMessage from '../../utils/translations/getApiMessage';
import { CountryModel } from '../../entities/Country';
import { getOperationsConfigs } from '../../utils/auth/auth';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = getOperationsConfigs(Currency.name);

@ObjectType()
class CurrencyPayloadType extends PayloadType() {
  @Field((_type) => Currency, { nullable: true })
  currency?: Currency;
}

@Resolver((_of) => Currency)
export class CurrencyResolver {
  @Query((_returns) => [Currency])
  @AuthMethod(operationConfigRead)
  async getAllCurrencies(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Currency>,
  ): Promise<Currency[]> {
    return CurrencyModel.find(customFilter);
  }

  @Query((_returns) => Currency)
  @AuthMethod(operationConfigRead)
  async getCurrency(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Currency>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Currency | null> {
    return CurrencyModel.findOne({ _id: id, ...customFilter });
  }

  @Mutation((_returns) => CurrencyPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createCurrencySchema })
  async createCurrency(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('input') input: CreateCurrencyInput,
  ): Promise<CurrencyPayloadType> {
    try {
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
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateCurrencySchema })
  async updateCurrency(
    @Localization() { lang }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Currency>,
    @Arg('input') input: UpdateCurrencyInput,
  ): Promise<CurrencyPayloadType> {
    try {
      const { id, ...restInput } = input;
      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.update.duplicate', lang }),
        };
      }

      const currency = await CurrencyModel.findOneAndUpdate(
        { _id: id, ...customFilter },
        restInput,
        { new: true },
      );

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
  @AuthMethod(operationConfigDelete)
  async deleteCurrency(
    @Localization() { lang }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CurrencyPayloadType> {
    try {
      const currency = await CurrencyModel.findByIdAndDelete(id);

      if (!currency) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.delete.error', lang }),
        };
      }

      const usedInCountries = await CountryModel.exists({ currency: currency.nameString });

      if (usedInCountries) {
        return {
          success: false,
          message: await getApiMessage({ key: 'currencies.delete.used', lang }),
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
