import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  ID,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import { Country, CountryModel } from '../../entities/Country';
import { City, CityModel } from '../../entities/City';
import { DocumentType } from '@typegoose/typegoose';
import PayloadType from '../common/PayloadType';
import { AddCityToCountryInput } from './AddCityToCountryInput';
import { UpdateCityInCountryInput } from './UpdateCityInCountryInput';
import { DeleteCityFromCountryInput } from './DeleteCityFromCountryInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateCountryInput } from './CreateCountryInput';
import { UpdateCountryInput } from './UpdateCountryInput';
import { ContextInterface } from '../../types/context';
import getApiMessage from '../../utils/translations/getApiMessage';
import {
  addCityToCountrySchema,
  createCountrySchema,
  deleteCityFromCountrySchema,
  updateCityInCountrySchema,
  updateCountrySchema,
} from '../../validation/countrySchema';
import getMessagesByKeys from '../../utils/translations/getMessagesByKeys';

@ObjectType()
class CountryPayloadType extends PayloadType() {
  @Field((_type) => Country, { nullable: true })
  country?: Country;
}

@Resolver((_for) => Country)
export class CountryResolver {
  @Query((_returns) => [Country])
  async getAllCountries(): Promise<Country[]> {
    return CountryModel.find({});
  }

  @Query((_returns) => Country)
  async getCountry(@Arg('id', (_type) => ID) id: string): Promise<Country> {
    const country = await CountryModel.findById(id);
    if (!country) {
      throw new Error('Country not found');
    }

    return country;
  }

  @Mutation((_returns) => CountryPayloadType)
  async createCountry(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => CreateCountryInput) input: CreateCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.countries.nameString',
        'validation.countries.currency',
      ]);
      await createCountrySchema({ lang, messages }).validate(input);

      const { nameString } = input;

      const existingCountries = await CountryModel.exists({
        nameString,
      });
      if (existingCountries) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.create.duplicate', lang }),
        };
      }

      const country = await CountryModel.create({
        ...input,
        cities: [],
      });

      if (!country) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.create.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'countries.create.success', lang }),
        country,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CountryPayloadType)
  async updateCountry(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => UpdateCountryInput) input: UpdateCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.countries.id',
        'validation.countries.nameString',
        'validation.countries.currency',
      ]);
      await updateCountrySchema({ lang, messages }).validate(input);

      const { id, nameString } = input;

      const country = await CountryModel.findById(id);

      if (!country) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.update.notFound', lang }),
        };
      }

      const existingCountries = await CountryModel.exists({
        _id: { $ne: id },
        nameString,
      });
      if (existingCountries) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.update.duplicate', lang }),
        };
      }

      const updatedCountry = await CountryModel.findByIdAndUpdate(
        id,
        {
          ...input,
          cities: country.cities,
        },
        { new: true },
      );

      if (!updatedCountry) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.update.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'countries.update.success', lang }),
        country: updatedCountry,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CountryPayloadType)
  async deleteCountry(
    @Ctx() ctx: ContextInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CountryPayloadType> {
    try {
      const { lang } = ctx.req;
      const country = await CountryModel.findById(id);
      if (!country) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.delete.notFound', lang }),
        };
      }

      const removedCountry = await CountryModel.deleteOne({ _id: id });

      // TODO remove cities data from all entities?
      const removedCities = await CityModel.deleteMany({ _id: { $in: country.cities } });

      if (!removedCountry.ok || !removedCities.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: 'countries.delete.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'countries.delete.success', lang }),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO validation
  @Mutation((_returns) => CountryPayloadType)
  async addCityToCountry(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => AddCityToCountryInput) input: AddCityToCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.countries.id',
        'validation.cities.name',
        'validation.cities.key',
      ]);
      await addCityToCountrySchema({ lang, messages, defaultLang }).validate(input);

      const { countryId, ...values } = input;
      const country = await CountryModel.findById(countryId);

      if (!country) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.create.notFound', lang }),
        };
      }

      const nameValues = input.name.map(({ value }) => value);
      const existingCities = await CityModel.exists({
        _id: { $in: country.cities },
        'name.value': {
          $in: nameValues,
        },
      });
      if (existingCities) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.create.duplicate', lang }),
        };
      }

      const city = await CityModel.create(values);
      if (!city) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.create.error', lang }),
        };
      }

      const updatedCountry = await CountryModel.findByIdAndUpdate(
        countryId,
        {
          $push: {
            cities: city.id,
          },
        },
        {
          new: true,
        },
      );
      if (!updatedCountry) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.create.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'cities.create.success', lang }),
        country: updatedCountry,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO validation
  @Mutation((_returns) => CountryPayloadType)
  async updateCityInCountry(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => UpdateCityInCountryInput) input: UpdateCityInCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { lang, defaultLang } = ctx.req;
      const messages = await getMessagesByKeys([
        'validation.countries.id',
        'validation.cities.id',
        'validation.cities.name',
        'validation.cities.key',
      ]);
      await updateCityInCountrySchema({ lang, messages, defaultLang }).validate(input);

      const { countryId, cityId, ...values } = input;
      const country = await CountryModel.findById(countryId);
      const city = await CityModel.findById(cityId);

      if (!country || !city) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.update.notFound', lang }),
        };
      }

      const nameValues = input.name.map(({ value }) => value);
      const existingCities = await CityModel.exists({
        _id: { $in: country.cities },
        'name.value': {
          $in: nameValues,
        },
      });
      if (existingCities) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.update.duplicate', lang }),
        };
      }

      const updatedCity = await CityModel.updateOne(
        {
          _id: cityId,
        },
        values,
      );
      if (!updatedCity.ok) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.update.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'cities.update.success', lang }),
        country,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO validation
  @Mutation((_returns) => CountryPayloadType)
  async deleteCityFromCountry(
    @Ctx() ctx: ContextInterface,
    @Arg('input', (_type) => DeleteCityFromCountryInput) input: DeleteCityFromCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { lang } = ctx.req;
      const messages = await getMessagesByKeys(['validation.countries.id', 'validation.cities.id']);
      await deleteCityFromCountrySchema({ lang, messages }).validate(input);

      const { countryId, cityId } = input;
      const country = await CountryModel.findById(countryId);
      const city = await CityModel.findById(cityId);

      if (!country || !city) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.delete.notFound', lang }),
        };
      }

      // TODO remove city data from all entities?
      const updatedCity = await CityModel.findByIdAndDelete(cityId);
      if (!updatedCity) {
        return {
          success: false,
          message: await getApiMessage({ key: 'cities.delete.error', lang }),
        };
      }

      return {
        success: true,
        message: await getApiMessage({ key: 'cities.delete.success', lang }),
        country,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @FieldResolver(() => [City])
  async cities(@Root() country: DocumentType<Country>): Promise<City[]> {
    return CityModel.find({ _id: { $in: country.cities } });
  }
}
