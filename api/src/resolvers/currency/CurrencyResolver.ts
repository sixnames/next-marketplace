import { Arg, Field, ID, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { Currency, CurrencyModel } from '../../entities/Currency';
import PayloadType from '../common/PayloadType';
import { CreateCurrencyInput } from './CreateCurrencyInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { UpdateCurrencyInput } from './UpdateCurrencyInput';

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

  // TODO messages and validation
  @Mutation((_returns) => CurrencyPayloadType)
  async createCurrency(@Arg('input') input: CreateCurrencyInput): Promise<CurrencyPayloadType> {
    try {
      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: 'exists',
        };
      }

      const currency = await CurrencyModel.create(input);

      if (!currency) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
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
  async updateCurrency(@Arg('input') input: UpdateCurrencyInput): Promise<CurrencyPayloadType> {
    try {
      const { id, ...restInput } = input;
      const exists = await CurrencyModel.exists({ nameString: input.nameString });
      if (exists) {
        return {
          success: false,
          message: 'exists',
        };
      }

      const currency = await CurrencyModel.findByIdAndUpdate(id, restInput, { new: true });

      if (!currency) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
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
  async deleteCurrency(@Arg('id', (_type) => ID) id: string): Promise<CurrencyPayloadType> {
    try {
      // TODO check if used in Countries
      const currency = await CurrencyModel.findByIdAndDelete(id);

      if (!currency) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }
}
