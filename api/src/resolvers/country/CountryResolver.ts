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
import PayloadType from '../common/PayloadType';
import { AddCityToCountryInput } from './AddCityToCountryInput';
import { UpdateCityInCountryInput } from './UpdateCityInCountryInput';
import { DeleteCityFromCountryInput } from './DeleteCityFromCountryInput';
import getResolverErrorMessage from '../../utils/getResolverErrorMessage';
import { CreateCountryInput } from './CreateCountryInput';
import { UpdateCountryInput } from './UpdateCountryInput';

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

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async createCountry(
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
          message: 'duplicate',
        };
      }

      const country = await CountryModel.create({
        ...input,
        cities: [],
      });

      if (!country) {
        return {
          success: false,
          message: 'country not found',
        };
      }

      return {
        success: true,
        message: 'success',
        country,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async updateCountry(
    @Arg('input', (_type) => UpdateCountryInput) input: UpdateCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { id, nameString } = input;

      const country = await CountryModel.findById(id);

      if (!country) {
        return {
          success: false,
          message: 'country not found',
        };
      }

      const existingCountries = await CountryModel.exists({
        _id: { $ne: id },
        nameString,
      });
      if (existingCountries) {
        return {
          success: false,
          message: 'duplicate',
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
          message: 'country not found',
        };
      }

      return {
        success: true,
        message: 'success',
        country: updatedCountry,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async deleteCountry(@Arg('id', (_type) => ID) id: string): Promise<CountryPayloadType> {
    try {
      const country = await CountryModel.findById(id);
      if (!country) {
        return {
          success: false,
          message: 'country not found',
        };
      }

      const removedCountry = await CountryModel.deleteOne({ _id: id });

      // TODO remove cities data from all entities?
      const removedCities = await CityModel.deleteMany({ _id: { $in: country.cities } });

      if (!removedCountry.ok || !removedCities.ok) {
        return {
          success: false,
          message: 'country not found',
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

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async addCityToCountry(
    @Arg('input', (_type) => AddCityToCountryInput) input: AddCityToCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { countryId, ...values } = input;
      const country = await CountryModel.findById(countryId);

      if (!country) {
        return {
          success: false,
          message: 'country not found',
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
          message: 'duplicate',
        };
      }

      const city = await CityModel.create(values);
      if (!city) {
        return {
          success: false,
          message: 'error',
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
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
        country: updatedCountry,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async updateCityInCountry(
    @Arg('input', (_type) => UpdateCityInCountryInput) input: UpdateCityInCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { countryId, cityId, ...values } = input;
      const country = await CountryModel.findById(countryId);
      const city = await CityModel.findById(cityId);

      if (!country || !city) {
        return {
          success: false,
          message: 'country or city not found',
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
          message: 'duplicate',
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
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
        country,
      };
    } catch (e) {
      return {
        success: false,
        message: getResolverErrorMessage(e),
      };
    }
  }

  // TODO messages and validation
  @Mutation((_returns) => CountryPayloadType)
  async deleteCityFromCountry(
    @Arg('input', (_type) => DeleteCityFromCountryInput) input: DeleteCityFromCountryInput,
  ): Promise<CountryPayloadType> {
    try {
      const { countryId, cityId } = input;
      const country = await CountryModel.findById(countryId);
      const city = await CityModel.findById(cityId);

      if (!country || !city) {
        return {
          success: false,
          message: 'country or city not found',
        };
      }

      // TODO remove city data from all entities?
      const updatedCity = await CityModel.findByIdAndDelete(cityId);
      if (!updatedCity) {
        return {
          success: false,
          message: 'error',
        };
      }

      return {
        success: true,
        message: 'success',
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
