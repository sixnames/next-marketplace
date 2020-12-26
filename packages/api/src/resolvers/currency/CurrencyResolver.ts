import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Currency, CurrencyModel } from '../../entities/Currency';
import PayloadType from '../commonInputs/PayloadType';
import { CreateCurrencyInput } from './CreateCurrencyInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateCurrencyInput } from './UpdateCurrencyInput';
import { CountryModel } from '../../entities/Country';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';
import { createCurrencySchema, updateCurrencySchema } from '@yagu/shared';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Currency.name);

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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input') input: CreateCurrencyInput,
  ): Promise<CurrencyPayloadType> {
    try {
      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage('currencies.create.duplicate'),
        };
      }

      const currency = await CurrencyModel.create(input);

      if (!currency) {
        return {
          success: false,
          message: await getApiMessage('currencies.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('currencies.create.success'),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Currency>,
    @Arg('input') input: UpdateCurrencyInput,
  ): Promise<CurrencyPayloadType> {
    try {
      const { id, ...restInput } = input;
      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: await getApiMessage('currencies.update.duplicate'),
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
          message: await getApiMessage('currencies.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('currencies.update.success'),
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
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CurrencyPayloadType> {
    try {
      const currency = await CurrencyModel.findByIdAndDelete(id);

      if (!currency) {
        return {
          success: false,
          message: await getApiMessage('currencies.delete.error'),
        };
      }

      const usedInCountries = await CountryModel.exists({ currency: currency.nameString });

      if (usedInCountries) {
        return {
          success: false,
          message: await getApiMessage('currencies.delete.used'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('currencies.delete.success'),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
