import {
  Arg,
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
import PayloadType from '../commonInputs/PayloadType';
import { AddCityToCountryInput } from './AddCityToCountryInput';
import { UpdateCityInCountryInput } from './UpdateCityInCountryInput';
import { DeleteCityFromCountryInput } from './DeleteCityFromCountryInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateCountryInput } from './CreateCountryInput';
import { UpdateCountryInput } from './UpdateCountryInput';
import {
  addCityToCountrySchema,
  createCountrySchema,
  deleteCityFromCountrySchema,
  updateCityInCountrySchema,
  updateCountrySchema,
} from '@yagu/validation';
import { AuthMethod, ValidateMethod } from '../../decorators/methodDecorators';
import {
  CustomFilter,
  Localization,
  LocalizationPayloadInterface,
} from '../../decorators/parameterDecorators';
import { FilterQuery } from 'mongoose';
import { RoleRuleModel } from '../../entities/RoleRule';

const {
  operationConfigCreate,
  operationConfigRead,
  operationConfigUpdate,
  operationConfigDelete,
} = RoleRuleModel.getOperationsConfigs(Country.name);

const {
  operationConfigCreate: operationConfigCreateCity,
  operationConfigUpdate: operationConfigUpdateCity,
  operationConfigDelete: operationConfigDeleteCity,
} = RoleRuleModel.getOperationsConfigs(City.name);

@ObjectType()
class CountryPayloadType extends PayloadType() {
  @Field((_type) => Country, { nullable: true })
  country?: Country;
}

@Resolver((_for) => Country)
export class CountryResolver {
  @Query((_returns) => [Country])
  @AuthMethod(operationConfigRead)
  async getAllCountries(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Country>,
  ): Promise<Country[]> {
    return CountryModel.find(customFilter);
  }

  @Query((_returns) => Country)
  @AuthMethod(operationConfigRead)
  async getCountry(
    @CustomFilter(operationConfigRead) customFilter: FilterQuery<Country>,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<Country> {
    const country = await CountryModel.findOne({ _id: id, ...customFilter });
    if (!country) {
      throw new Error('Country not found');
    }

    return country;
  }

  @Mutation((_returns) => CountryPayloadType)
  @AuthMethod(operationConfigCreate)
  @ValidateMethod({ schema: createCountrySchema })
  async createCountry(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input', (_type) => CreateCountryInput) input: CreateCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { nameString } = input;

      const existingCountries = await CountryModel.exists({
        nameString,
      });
      if (existingCountries) {
        return {
          success: false,
          message: await getApiMessage('countries.create.duplicate'),
        };
      }

      const country = await CountryModel.create({
        ...input,
        cities: [],
      });

      if (!country) {
        return {
          success: false,
          message: await getApiMessage('countries.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('countries.create.success'),
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
  @AuthMethod(operationConfigUpdate)
  @ValidateMethod({ schema: updateCountrySchema })
  async updateCountry(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @CustomFilter(operationConfigUpdate) customFilter: FilterQuery<Country>,
    @Arg('input', (_type) => UpdateCountryInput) input: UpdateCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { id, nameString } = input;

      const country = await CountryModel.findOne({ _id: id, ...customFilter });

      if (!country) {
        return {
          success: false,
          message: await getApiMessage('countries.update.notFound'),
        };
      }

      const existingCountries = await CountryModel.exists({
        _id: { $ne: id },
        nameString,
      });
      if (existingCountries) {
        return {
          success: false,
          message: await getApiMessage('countries.update.duplicate'),
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
          message: await getApiMessage('countries.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('countries.update.success'),
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
  @AuthMethod(operationConfigDelete)
  async deleteCountry(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('id', (_type) => ID) id: string,
  ): Promise<CountryPayloadType> {
    try {
      const country = await CountryModel.findById(id);
      if (!country) {
        return {
          success: false,
          message: await getApiMessage('countries.delete.notFound'),
        };
      }

      const removedCountry = await CountryModel.deleteOne({ _id: id });

      // TODO remove cities data from all entities?
      const removedCities = await CityModel.deleteMany({ _id: { $in: country.cities } });

      if (!removedCountry.ok || !removedCities.ok) {
        return {
          success: false,
          message: await getApiMessage('countries.delete.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('countries.delete.success'),
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  @Mutation((_returns) => CountryPayloadType)
  @AuthMethod(operationConfigCreateCity)
  @ValidateMethod({ schema: addCityToCountrySchema })
  async addCityToCountry(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input', (_type) => AddCityToCountryInput) input: AddCityToCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { countryId, ...values } = input;
      const country = await CountryModel.findById(countryId);

      if (!country) {
        return {
          success: false,
          message: await getApiMessage('cities.create.notFound'),
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
          message: await getApiMessage('cities.create.duplicate'),
        };
      }

      const city = await CityModel.create(values);
      if (!city) {
        return {
          success: false,
          message: await getApiMessage('cities.create.error'),
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
          message: await getApiMessage('cities.create.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('cities.create.success'),
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
  @AuthMethod(operationConfigUpdateCity)
  @ValidateMethod({ schema: updateCityInCountrySchema })
  async updateCityInCountry(
    @CustomFilter(operationConfigUpdateCity) customFilter: FilterQuery<City>,
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input', (_type) => UpdateCityInCountryInput) input: UpdateCityInCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { countryId, cityId, ...values } = input;
      const country = await CountryModel.findById(countryId);
      const city = await CityModel.findOne({ _id: cityId, ...customFilter });

      if (!country || !city) {
        return {
          success: false,
          message: await getApiMessage('cities.update.notFound'),
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
          message: await getApiMessage('cities.update.duplicate'),
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
          message: await getApiMessage('cities.update.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('cities.update.success'),
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
  @AuthMethod(operationConfigDeleteCity)
  @ValidateMethod({ schema: deleteCityFromCountrySchema })
  async deleteCityFromCountry(
    @Localization() { getApiMessage }: LocalizationPayloadInterface,
    @Arg('input', (_type) => DeleteCityFromCountryInput) input: DeleteCityFromCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { countryId, cityId } = input;
      const country = await CountryModel.findById(countryId);
      const city = await CityModel.findById(cityId);

      if (!country || !city) {
        return {
          success: false,
          message: await getApiMessage('cities.delete.notFound'),
        };
      }

      // TODO remove city data from all entities?
      const updatedCity = await CityModel.findByIdAndDelete(cityId);
      if (!updatedCity) {
        return {
          success: false,
          message: await getApiMessage('cities.delete.error'),
        };
      }

      return {
        success: true,
        message: await getApiMessage('cities.delete.success'),
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
